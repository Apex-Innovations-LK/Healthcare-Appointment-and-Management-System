# Use a base image with Java 21
#FROM maven:3.9.6-eclipse-temurin-21
FROM amazoncorretto:21-alpine-jdk

# Set the working directory in the container
WORKDIR /app

# Copy the JAR file into the container
COPY target/HealthCare-0.0.1-SNAPSHOT.jar /app/app.jar

# Copy the .env file into the container
COPY /docker/.env /app/.env

# Expose the port that your Spring Boot application runs on (default is 8080, but change if needed)
EXPOSE 8081

# Command to run the JAR file.  We don't need to specify the .env here, as the app loads it.
CMD ["java", "-jar", "app.jar"]