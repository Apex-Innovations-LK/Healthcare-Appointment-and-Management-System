package com.healthcare.chat.service;

import com.healthcare.chat.model.ChatMessage;
import com.healthcare.chat.model.ChatSession;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import io.github.cdimascio.dotenv.Dotenv;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
public class ChatService {

    private final WebClient webClient;
    private final String apiKey;
    private final Map<String, ChatSession> sessionMap = new ConcurrentHashMap<>();

    public ChatService(WebClient.Builder builder) {
        this.webClient = builder
                .baseUrl(
                        "https://api-inference.huggingface.co/models/ContactDoctor/Bio-Medical-MultiModal-Llama-3-8B-V1")
                .build();

        // Load from .env
        Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();
        this.apiKey = dotenv.get("HUGGINGFACE_API_KEY");
    }

    public ChatMessage sendMessage(String sessionId, String userMessage) {
        ChatSession session = sessionMap.computeIfAbsent(sessionId, ChatSession::new);
        session.getMessages().add(new ChatMessage("user", userMessage));

        // Optional: Limit conversation history to last 20 messages
        if (session.getMessages().size() > 20) {
            session.setMessages(
                    session.getMessages().subList(session.getMessages().size() - 20, session.getMessages().size()));
        }

        String fullPrompt = session.getMessages().stream()
                .map(msg -> msg.getRole() + ": " + msg.getContent())
                .collect(Collectors.joining("\n"));

        String aiResponse = callAIModel(fullPrompt);
        ChatMessage assistantReply = new ChatMessage("assistant", aiResponse);
        session.getMessages().add(assistantReply);

        return assistantReply;
    }

    private String callAIModel(String prompt) {
        try {
            Mono<List<HuggingFaceResponse>> response = webClient.post()
                    .header("Authorization", "Bearer " + apiKey)
                    .bodyValue(Map.of("inputs", prompt))
                    .retrieve()
                    .bodyToMono(new ParameterizedTypeReference<>() {
                    });

            List<HuggingFaceResponse> resultList = response.block();
            if (resultList != null && !resultList.isEmpty()) {
                return resultList.get(0).getGeneratedText();
            } else {
                return "No response from the AI model.";
            }
        } catch (Exception e) {
            // Log the error in real applications
            return "Sorry, I'm having trouble responding right now.";
        }
    }

    // Response DTO for Hugging Face
    public static class HuggingFaceResponse {
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
