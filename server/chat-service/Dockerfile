# 1. Build Stage
FROM maven:3.9.4-eclipse-temurin-21 AS build

WORKDIR /app

COPY pom.xml .
RUN mvn dependency:go-offline -B

COPY src ./src

RUN mvn clean package -DskipTests

# 2. Runtime Stage
FROM eclipse-temurin:21-jdk-jammy AS runtime

ENV APP_HOME=/opt/chat-service
WORKDIR $APP_HOME

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8083

ENTRYPOINT ["java", "-jar", "app.jar"]




