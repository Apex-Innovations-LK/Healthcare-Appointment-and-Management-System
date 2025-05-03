package com.healthcare.chat.service;

import com.healthcare.chat.model.ChatMessage;
import com.healthcare.chat.model.ChatSession;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import org.springframework.http.MediaType;
import org.springframework.http.client.MultipartBodyBuilder;
import org.springframework.util.LinkedMultiValueMap;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class ChatService {

    private final WebClient webClient;
    private final Map<String, ChatSession> sessionMap = new ConcurrentHashMap<>();

    public ChatService(WebClient.Builder builder) {
        this.webClient = builder
                .baseUrl("https://ce1d-34-168-122-218.ngrok-free.app")
                .build();
    }

    public ChatMessage sendMessage(String sessionId, String userMessage, MultipartFile imageFile) {
        ChatSession session = sessionMap.computeIfAbsent(sessionId, ChatSession::new);
        session.getMessages().add(new ChatMessage("user", userMessage));

        // Conversation trimming if needed
        if (session.getMessages().size() > 20) {
            session.setMessages(session.getMessages()
                    .subList(session.getMessages().size() - 20, session.getMessages().size()));
        }

        String aiResponse = callAIModel(userMessage, imageFile);
        ChatMessage assistantReply = new ChatMessage("assistant", aiResponse);
        session.getMessages().add(assistantReply);

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
