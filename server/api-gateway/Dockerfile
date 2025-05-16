## 1) BUILD THE APPLICATION
#FROM maven:3.9.6-eclipse-temurin-21 AS build
#
## set working directory
#WORKDIR /app
#
## copy pom and resolve dependencies
#COPY pom.xml .
#RUN mvn -q dependency:go-offline
#
## copy source code
#COPY src ./src
#
## build Spring Boot fat JAR (skip tests for faster build)
#RUN mvn clean package -DskipTests
#
## 2) RUNTIME IMAGE
#FROM eclipse-temurin:21-jdk-jammy AS runtime
#
## set application directory
#ENV APP_HOME=/opt/api-gateway
#WORKDIR $APP_HOME
#
## JVM flags (especially useful for Java 17+ modules)
#ENV JAVA_OPTS="\
# --add-opens=java.base/java.lang=ALL-UNNAMED \
# --add-opens=java.base/java.util=ALL-UNNAMED \
# --add-opens=java.base/sun.nio.ch=ALL-UNNAMED"
#
## copy the fat JAR from build stage
#COPY --from=build /app/target/api-gateway-*.jar app.jar
#
## expose the default Spring Boot port
#EXPOSE 8080
#
## run the application
#ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
