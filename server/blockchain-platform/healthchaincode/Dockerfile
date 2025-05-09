# Stage 1: Build the chaincode
FROM maven:3.8.6-openjdk-11 AS builder
WORKDIR /chaincode
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src ./src
RUN mvn package -DskipTests

# Stage 2: Package the JAR for Fabric peer
FROM eclipse-temurin:11-jre
WORKDIR /chaincode
COPY --from=builder /chaincode/target/*.jar chaincode.jar
CMD ["java", "-jar", "chaincode.jar"]
