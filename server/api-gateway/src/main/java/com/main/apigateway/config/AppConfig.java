package com.main.apigateway.config;

import com.main.apigateway.filter.JwtValidationFilter;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AppConfig {
    @Bean
    public FilterRegistrationBean<JwtValidationFilter> filter(JwtValidationFilter filter) {
        FilterRegistrationBean<JwtValidationFilter> reg = new FilterRegistrationBean<>();
        reg.setFilter(filter);
        reg.addUrlPatterns("/api/*");
        return reg;
    }
}
