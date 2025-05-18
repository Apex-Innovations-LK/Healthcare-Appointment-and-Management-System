# Stage 1: Build the Spring Boot app
FROM maven:3.8.6-openjdk-11 AS builder
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Run the app
FROM openjdk:11-jre-slim
WORKDIR /app

# Install bash to run .sh scripts from Java
RUN apt-get update && apt-get install -y bash && rm -rf /var/lib/apt/lists/*

# Copy the built jar
COPY --from=builder /app/target/*.jar app.jar

# Copy the script so Java can invoke it
COPY ./scripts/interact_chaincode.sh ./interact_chaincode.sh
RUN chmod +x ./interact_chaincode.sh

# Run the app
CMD ["java", "-jar", "app.jar"]
