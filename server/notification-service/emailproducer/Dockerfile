# # Use an OpenJDK base image
# FROM openjdk:17-jdk-slim

# # Set working directory inside container
# WORKDIR /app

# # Copy the JAR file into the container
# COPY target/*.jar app.jar

# # Expose the port your Spring Boot app runs on
# EXPOSE 8080

# # Command to run the app
# ENTRYPOINT ["java", "-jar", "app.jar"]

# Use Maven to build the Spring Boot app
FROM maven:3.8.4-openjdk-17-slim as build

# Set working directory
WORKDIR /app

# Copy pom.xml and source code
COPY pom.xml .
COPY src ./src

# Build the app and create the .jar file
RUN mvn clean package -DskipTests

# Now create the final image with JDK for runtime
FROM openjdk:17-slim

# Set working directory
WORKDIR /app

# Copy the built .jar file from the previous stage
COPY --from=build /app/target/*.jar app.jar

# Expose the required port
EXPOSE 8080

# Run the Spring Boot application
CMD ["java", "-jar", "app.jar"]
