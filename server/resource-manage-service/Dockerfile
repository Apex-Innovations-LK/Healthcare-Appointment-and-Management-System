# 1) BUILD THE APPLICATION
FROM maven:3.9.4-eclipse-temurin-17 AS build
# create workdir
WORKDIR /app
# copy pom and resolve deps first
COPY pom.xml .
RUN mvn -q dependency:go-offline
# copy sources
COPY src ./src
# build fat‑jar (skip tests for faster CI; remove `-DskipTests` if you need them)
RUN mvn clean package -DskipTests

# 2) RUNTIME IMAGE
FROM eclipse-temurin:17-jdk-jammy AS runtime
ENV APP_HOME=/opt/resource-manage-service
WORKDIR $APP_HOME

# Install necessary tools for certificate handling
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    openssl \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Create the directory for the truststore
RUN mkdir -p /tmp

# Import certificates to Java cacerts
RUN keytool -importkeystore -srckeystore $JAVA_HOME/lib/security/cacerts -destkeystore /tmp/supabase-truststore.jks -srcstorepass changeit -deststorepass changeit

# copy fat‑jar
COPY --from=build /app/target/*.jar app.jar

# Copy the truststore files
COPY truststore/*.jks /tmp/

# JVM flags
ENV JAVA_OPTS=" \
    --add-opens=java.base/java.lang=ALL-UNNAMED \
    --add-opens=java.base/java.util=ALL-UNNAMED \
    --add-opens=java.base/sun.nio.ch=ALL-UNNAMED"

# expose springboot port
EXPOSE 8087

# run!
ENTRYPOINT ["sh","-c","java $JAVA_OPTS -jar app.jar"]