# 1) BUILD THE APPLICATION
FROM maven:3.9.4-eclipse-temurin-17 AS build

# create workdir
WORKDIR /app

# copy pom and resolve deps first
COPY pom.xml .
RUN mvn -q dependency:go-offline

# copy sources
COPY src ./src
# if you keep python inside the jar resources, you can omit this copy
COPY python ./python

# build fat‑jar (skip tests for faster CI; remove `-DskipTests` if you need them)
RUN mvn clean package -DskipTests

# 2) RUNTIME  IMAGE
FROM eclipse-temurin:17-jdk-jammy AS runtime

ENV APP_HOME=/opt/health-analytics
WORKDIR $APP_HOME

# install Python 3 + pip
RUN apt-get update -qq \
 && apt-get install -y --no-install-recommends python3 python3-pip \
 && rm -rf /var/lib/apt/lists/*

# install python deps
COPY python/requirements.txt /tmp/requirements.txt
RUN pip3 install --no-cache-dir -r /tmp/requirements.txt

# copy fat‑jar & python scripts
COPY --from=build /app/target/*.jar app.jar
COPY python            ./python

# JVM flags that you already need for Spark / Java17
ENV JAVA_OPTS="\
 --add-opens=java.base/java.lang=ALL-UNNAMED \
 --add-opens=java.base/java.util=ALL-UNNAMED \
 --add-opens=java.base/sun.nio.ch=ALL-UNNAMED"

# expose springboot port
EXPOSE 8084

## --- run! --------------------------------------------------------------
ENTRYPOINT ["sh","-c","java $JAVA_OPTS -jar app.jar"]
