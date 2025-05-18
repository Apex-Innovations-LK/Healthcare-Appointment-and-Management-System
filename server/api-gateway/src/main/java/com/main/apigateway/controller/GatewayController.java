package com.main.apigateway.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/api")
public class GatewayController {

    private final RestTemplate restTemplate = new RestTemplate();

    @RequestMapping(
            value = "/{service}/**",
            method = {
                    RequestMethod.GET, RequestMethod.POST,
                    RequestMethod.PUT, RequestMethod.DELETE,
                    RequestMethod.PATCH
            }
    )
    public ResponseEntity<?> proxyRequest(
            HttpServletRequest request,
            @PathVariable String service,
            @RequestBody(required = false) String body,
            @RequestHeader HttpHeaders headers
    ) {
        try {
            String requestURI = request.getRequestURI();
            String basePath = "/api/" + service + "/";
            String relativePath = requestURI.substring(basePath.length());

            // Final destination URL
            String destinationUrl = "http://" + service + "-service:80" + getPort(service) + "/api/" + service + "/" + relativePath;

            HttpMethod httpMethod = HttpMethod.valueOf(request.getMethod());

            // Debug prints
            System.out.println("----------------------------------------");
            System.out.println("---------- API GATEWAY DEBUG ----------");
            System.out.println("Service       : " + service);
            System.out.println("HTTP Method   : " + httpMethod);
            System.out.println("Request URI   : " + requestURI);
            System.out.println("Relative Path : " + relativePath);
            System.out.println("Target URL    : " + destinationUrl);
            System.out.println("Request Body  : " + body);
            System.out.println("Headers       : ");
            headers.forEach((key, value) -> System.out.println("  " + key + ": " + value));
            System.out.println("----------------------------------------");

            HttpHeaders forwardHeaders = new HttpHeaders();
            headers.forEach((key, value) -> {
                if (!key.equalsIgnoreCase("host")) {
                    forwardHeaders.put(key, value);
                }
            });

            HttpEntity<String> entity = new HttpEntity<>(body, forwardHeaders);
            return restTemplate.exchange(destinationUrl, httpMethod, entity, String.class);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid service or HTTP method.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Gateway error: " + e.getMessage());
        }
    }

    private String getPort(String service) {
        return switch (service.toLowerCase()) {
            case "appointment" -> "81"; // http://localhost:8081
            case "blockchain" -> "82";   // http://localhost:8082
            case "chat" -> "83";   // http://localhost:8083
            case "analytics" -> "84";   // http://localhost:8084
            case "ipfs" -> "85";   // http://localhost:8085
            case "doctors" -> "86"; // http://localhost:8086
            case "resource" -> "87";   // http://localhost:8087
            case "auth" -> "88";   // http://localhost:8088
            case "schedule" -> "89";   // http://localhost:8089
            case "webrtc" -> "90";   // http://localhost:8090

            default -> throw new IllegalArgumentException("Unknown service: " + service);
        };
    }
}
