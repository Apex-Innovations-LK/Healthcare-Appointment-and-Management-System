# Use OpenJDK 21 base image
FROM eclipse-temurin:21

# Set the working directory inside the container
WORKDIR /app

# Copy the correct JAR file into the container
COPY target/chat-service-1.0.0.jar app.jar

# Command to run your app
CMD ["java", "-jar", "app.jar"]
