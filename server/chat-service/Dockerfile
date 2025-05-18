
FROM eclipse-temurin:17-jdk-alpine

WORKDIR /app

COPY target/chat-service-1.0.0.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
# ---- Stage 1: Build the app ----
FROM maven:3.9-eclipse-temurin-21 AS builder
WORKDIR /app

# Copy only necessary files first (for layer caching)
COPY pom.xml .
COPY src ./src

# Build the JAR
RUN mvn clean package -DskipTests

# ---- Stage 2: Run the app ----
FROM eclipse-temurin:21
WORKDIR /app

# Copy the JAR from the builder stage
COPY --from=builder /app/target/chat-service-1.0.0.jar app.jar

# Run the Spring Boot app
CMD ["java", "-jar", "app.jar"]

