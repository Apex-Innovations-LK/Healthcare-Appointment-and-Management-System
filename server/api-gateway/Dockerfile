# 1) BUILD THE APPLICATION
FROM maven:3.9.6-eclipse-temurin-21 AS build

# Set working directory inside container
WORKDIR /app

# Copy the pom.xml separately to resolve dependencies first
COPY pom.xml .
RUN mvn -q dependency:go-offline

# Now copy the full source code
COPY src ./src

# Build the Spring Boot fat JAR (skip tests for faster build)
RUN mvn clean package -DskipTests

# 2) RUNTIME IMAGE
FROM eclipse-temurin:21-jdk-jammy AS runtime

# App home inside container
ENV APP_HOME=/opt/apigateway
WORKDIR $APP_HOME

# Copy the generated JAR from build stage
COPY --from=build /app/target/*.jar app.jar

# Set JVM options if needed (optional, can be removed)
ENV JAVA_OPTS="\
 --add-opens=java.base/java.lang=ALL-UNNAMED \
 --add-opens=java.base/java.util=ALL-UNNAMED"

# Expose port for Spring Boot application
EXPOSE 8080

# Run the application
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
