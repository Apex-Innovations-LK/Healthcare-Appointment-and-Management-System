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
            String destinationUrl = "http://localhost:808" + getPort(service) + "/api/" + service + "/" + relativePath;

            HttpMethod httpMethod = HttpMethod.valueOf(request.getMethod());

            // Debug prints
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
            case "auth" -> "1";   // http://localhost:8081
            case "schedule" -> "2";   // http://localhost:8082
            //case "staff" -> "3";  // http://localhost:8083
            default -> throw new IllegalArgumentException("Unknown service: " + service);
        };
    }
}
