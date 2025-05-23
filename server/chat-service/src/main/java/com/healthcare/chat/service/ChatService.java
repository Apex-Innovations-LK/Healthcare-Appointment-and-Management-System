package com.healthcare.chat.service;

import com.healthcare.chat.model.ChatMessage;
import com.healthcare.chat.model.ChatSession;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import org.springframework.http.MediaType;
import org.springframework.http.client.MultipartBodyBuilder;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class ChatService {

    private final WebClient webClient;
    private final Map<String, ChatSession> sessionMap = new ConcurrentHashMap<>();
    
    @Autowired
    private ChatKafkaProducer kafkaProducer;

    public ChatService(WebClient.Builder builder) {
        this.webClient = builder
                .baseUrl("https://quietly-evolved-raptor.ngrok-free.app") // the link should be changed.
                .build();
    }

    private String buildPromptFromMessages(ChatSession session) {
        StringBuilder sb = new StringBuilder();
        for (ChatMessage msg : session.getMessages()) {
            sb.append(msg.getRole()).append(": ").append(msg.getContent()).append("\n");
        }
        return sb.toString();
    }


    public ChatMessage sendMessage(String sessionId, String userID, String userMessage, MultipartFile imageFile) {
        ChatSession session = sessionMap.computeIfAbsent(sessionId, ChatSession::new);

        // If image is provided, override user message to avoid sending large binary data
        String finalUserMessage = (imageFile != null && !imageFile.isEmpty())
                ? userMessage + " [Image received]"
                : userMessage;

        ChatMessage userChatMessage = new ChatMessage("user", finalUserMessage);
        session.getMessages().add(userChatMessage);
        kafkaProducer.sendChatMessage(sessionId,userID,"user", userChatMessage); // Send to Kafka

        // Limit conversation size
        if (session.getMessages().size() > 20) {
            session.setMessages(session.getMessages()
                    .subList(session.getMessages().size() - 20, session.getMessages().size()));
        }



        //System.out.print(session.getMessages());

        // Send image to Flask API only, not Kafka
        String promptWithContext = buildPromptFromMessages(session);
        //String aiResponse = callAIModel(userMessage, imageFile);
        String aiResponse = callAIModel(promptWithContext, imageFile);
        ChatMessage assistantReply = new ChatMessage("assistant", aiResponse);
        session.getMessages().add(assistantReply);
        kafkaProducer.sendChatMessage(sessionId,userID, "assistant", assistantReply); // Send to Kafka

        return assistantReply;
    }

    private String callAIModel(String question, MultipartFile imageFile) {
        try {
            MultipartBodyBuilder builder = new MultipartBodyBuilder();
            builder.part("question", question);

            if (imageFile != null && !imageFile.isEmpty()) {
                builder.part("image", imageFile.getResource());
            }

            Mono<FlaskResponse> response = webClient.post()
                    .uri("/diagnose")
                    .contentType(MediaType.MULTIPART_FORM_DATA)
                    .body(BodyInserters.fromMultipartData(builder.build()))
                    .retrieve()
                    .bodyToMono(FlaskResponse.class);

            FlaskResponse result = response.block();
            return result != null ? result.getGeneratedText() : "No response from the model.";
        } catch (Exception e) {
            return "Sorry, I'm having trouble responding right now.";
        }
    }

    // Response DTO matching Flask API response
    public static class FlaskResponse {
        @JsonProperty("generated_text")
        private String generatedText;

        public String getGeneratedText() {
            return generatedText;
        }

        public void setGeneratedText(String generatedText) {
            this.generatedText = generatedText;
        }
    }
}