# Stage 1: Build the Spring Boot app with Java 21
FROM maven:3.9.6-eclipse-temurin-21 AS builder
WORKDIR /app

# Copy Maven config and download dependencies
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy source code and build the app
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Run the app using Java 21
FROM eclipse-temurin:21-jre
WORKDIR /app

# Install bash to run .sh scripts from Java
RUN apt-get update && apt-get install -y bash && rm -rf /var/lib/apt/lists/*

# Copy the built jar file from builder stage
COPY --from=builder /app/target/*.jar app.jar

# Copy the shell script to be invoked from Java
COPY ./scripts/interact_chaincode.sh /app/scripts/interact_chaincode.sh
RUN chmod +x /app/scripts/interact_chaincode.sh

# Set environment variables for Hyperledger Fabric paths
ENV FABRIC_NETWORK_CONFIG_PATH=/app/fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/connection-org1.yaml
ENV FABRIC_CERT_PATH=/app/fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp/signcerts/cert.pem
ENV FABRIC_KEY_DIR=/app/fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp/keystore/

# Expose Spring Boot port
EXPOSE 8082

# Default command to run the app
CMD ["java", "-jar", "app.jar"]
