1. Move to the "Microservice-Doctor/springboot-kafka-project" directory through terminal.

2. - Windows
    `mvnw clean package -DskipTests`

   - Linux
   `mvn clean package -DskipTests`

3. Convert .env.txt to .env files in both ./ ./docker/ directories.

4. Build the image
 `docker build -t doctor-microservice .`

5. Run the container
  `docker-compose up -d`

6. Stop the container
  `docker-compose down`
  