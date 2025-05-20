package com.team8.healthanalytics.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.spark.sql.SparkSession;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import jakarta.annotation.PreDestroy;

@Configuration
public class AppConfig implements WebMvcConfigurer {
    
    private SparkSession sparkSession;
    
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
    
    @Bean
    public ObjectMapper objectMapper() {
        return new ObjectMapper();
    }
    
    @Bean
    public SparkSession sparkSession() {
        // Required for Java 17+ compatibility
        System.setProperty("java.security.manager", "allow");
        
        // Set Hadoop properties to avoid security manager issues
        System.setProperty("spark.hadoop.fs.permissions.umask-mode", "022");
        System.setProperty("spark.hadoop.fs.defaultFS", "file:///");
        
        // Disable Hadoop security for local development
        System.setProperty("hadoop.home.dir", System.getProperty("user.dir"));
        System.setProperty("spark.hadoop.hadoop.security.authentication", "simple");
        System.setProperty("spark.hadoop.hadoop.security.authorization", "false");
        
        // Remove problematic Spark metrics system properties
        // System.setProperty("spark.metrics.conf", "false");
        // System.setProperty("spark.metrics.enabled", "false");
        System.setProperty("spark.ui.enabled", "false");
        System.setProperty("spark.ui.showConsoleProgress", "false");
        
        // Initialize Spark session with configuration for Java 17+
        sparkSession = SparkSession.builder()
                .appName("HealthcareAnalytics")
                .master("local[*]")
                .config("spark.driver.memory", "2g")
                .config("spark.driver.host", "35.184.60.72")
                .config("spark.sql.session.timeZone", "UTC")
                .config("spark.ui.enabled", "false") 
                .config("spark.ui.showConsoleProgress", "false")
                // Remove problematic metrics configs
                // .config("spark.metrics.enabled", "false")
                .config("spark.metrics.staticSources.enabled", "false")
                .config("spark.metrics.appStatusSource.enabled", "false")
                .config("spark.metrics.executorMetricsSource.enabled", "false")
                .config("spark.metrics.jvmSource.enabled", "false")
                // Avoid security manager issues
                .config("spark.driver.extraJavaOptions", "-Djava.security.manager=allow")
                .config("spark.executor.extraJavaOptions", "-Djava.security.manager=allow")
                .getOrCreate();
            
        return sparkSession;
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")  // Allow CORS for all endpoints
                .allowedOrigins("http://35.184.60.72")  // Allow requests from 35.184.60.72:4200
                .allowedMethods("GET", "POST", "PUT", "DELETE")  // Allow specific HTTP methods
                .allowedHeaders("*")  // Allow all headers
                .allowCredentials(true);  // Allow credentials if necessary (e.g., cookies)
    }
    
    @PreDestroy
    public void closeSparkSession() {
        if (sparkSession != null) {
            sparkSession.close();
        }
    }
}
