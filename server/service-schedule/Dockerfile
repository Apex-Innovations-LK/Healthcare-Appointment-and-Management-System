# ---------- Build Stage ----------
FROM maven:3.9.6-eclipse-temurin-21 AS build

WORKDIR /build
# cache deps
COPY pom.xml .
RUN mvn dependency:go-offline -B

# compile & package
COPY src ./src
RUN mvn clean package -DskipTests -B

# ---------- Run Stage ----------
FROM amazoncorretto:21-alpine-jdk

WORKDIR /app
COPY --from=build /build/target/service-schedule-0.0.1-SNAPSHOT.jar app.jar
COPY .env .env
COPY entrypoint.sh entrypoint.sh
RUN chmod +x entrypoint.sh

EXPOSE 8089
ENTRYPOINT ["./entrypoint.sh"]
