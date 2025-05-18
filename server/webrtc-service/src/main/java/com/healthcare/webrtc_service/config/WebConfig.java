package com.healthcare.webrtc_service.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import java.util.Arrays;

@Configuration
public class WebConfig {
    
    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        
        // Allow credentials
        config.setAllowCredentials(true);
        
        // When using withCredentials:true, you MUST specify exact origins (not wildcards)
        config.addAllowedOrigin("http://localhost:4200");
        
        // Allow all headers and methods
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");
        
        // Explicitly allow common headers
        config.setExposedHeaders(Arrays.asList(
            "Authorization", "Content-Type", "Access-Control-Allow-Origin",
            "Access-Control-Allow-Methods", "Access-Control-Allow-Headers"
        ));
        
        // Apply this configuration to all paths
        source.registerCorsConfiguration("/**", config);
        
        return new CorsFilter(source);
    }
}