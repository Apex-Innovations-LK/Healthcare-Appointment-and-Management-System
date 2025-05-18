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
#FROM maven:3.9.6-eclipse-temurin-21 AS build

#WORKDIR /build

# Cache dependencies
#COPY pom.xml .
#RUN mvn dependency:go-offline
#DATABASE_PASSWORD
# Copy source and build
#COPY src ./src
#RUN mvn clean package -DskipTests

# ---------- Run Stage ----------
#FROM amazoncorretto:21

#WORKDIR /app

# Copy built jar
#COPY --from=build /build/target/*.jar app.jar

# Set runtime environment variables
#ENV DB_URL=jdbc:postgresql://aws-0-ap-south-1.pooler.supabase.com:5432/postgres \
#    SPRING_PROFILES_ACTIVE=prod

# Expose app port
#EXPOSE 8080

# Run application
#ENTRYPOINT ["java", "-jar", "app.jar"]

# Use a base image with Java 21
#FROM maven:3.9.6-eclipse-temurin-21
FROM amazoncorretto:21-alpine-jdk

# Set the working directory in the container
WORKDIR /app

# Copy the JAR file into the container
COPY target/springboot-kafka-project-0.0.1-SNAPSHOT.jar /app/app.jar

# Copy the .env file into the container
COPY /docker/.env /app/.env

# Expose the port that your Spring Boot application runs on (default is 8080, but change if needed)
EXPOSE 8080

# Command to run the JAR file.  We don't need to specify the .env here, as the app loads it.
CMD ["java", "-jar", "app.jar"]

