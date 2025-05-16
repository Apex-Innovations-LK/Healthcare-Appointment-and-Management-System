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
FROM eclipse-temurin:21-jdk-jammy AS runtime

WORKDIR /app

# Copy built jar
COPY --from=build /build/target/*.jar app.jar

# Set runtime environment variables
ENV DB_URL=jdbc:postgresql://db.sbihxmjllrogpwipwrbq.supabase.co:5432/postgres \
    SPRING_PROFILES_ACTIVE=prod

# Expose app port
EXPOSE 8081

# Run application
ENTRYPOINT ["java", "-jar", "app.jar"]