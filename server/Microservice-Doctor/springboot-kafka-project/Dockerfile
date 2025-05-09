# FROM maven:3.3.2-openjdk-21 AS build
# WORKDIR /build
# COPY pom.xml .
# RUN mvn dependency:go-offline
# COPY src ./src
# RUN mvn clean package -DskipTests

# FROM amazoncorretto:21

# WORKDIR /app
# COPY --from=build /build/target/springboot-kafka-project-0.0.1-SNAPSHOT.jar /app/

# EXPOSE 8080

# ENV DB_URL=jdbc:postgresql://aws-0-ap-south-1.pooler.supabase.com:5432/postgres

# CMD java -jar springboot-kafka-project-0.0.1-SNAPSHOT.jar -Dspring.datasource.url=${DB_URL}
# ---------- Build Stage ----------
FROM maven:3.9.6-eclipse-temurin-21 AS build

WORKDIR /build

# Cache dependencies
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy source and build
COPY src ./src
RUN mvn clean package -DskipTests

# ---------- Run Stage ----------
FROM amazoncorretto:21

WORKDIR /app

# Copy built jar
COPY --from=build /build/target/*.jar app.jar

# Set runtime environment variables
ENV DB_URL=jdbc:postgresql://aws-0-ap-south-1.pooler.supabase.com:5432/postgres \
    SPRING_PROFILES_ACTIVE=prod

# Expose app port
EXPOSE 8080

# Run application
ENTRYPOINT ["java", "-jar", "app.jar"]
