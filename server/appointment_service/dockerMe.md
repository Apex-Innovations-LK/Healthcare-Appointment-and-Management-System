1. Go to the "appointment_service" through the terminal

2. - Windows - `mvnw clean package -DskipTests`
   - Ubuntu - `mvn clean package -DskipTests`

3. Convert both .env.txt to .env in ./ and ./docker directories

4. `docker build -t appointment-microservice .` - build the image

5. `docker-compose up -d` - run the appointment service, kafka & zookeeper

6. `docker-compose down` - stop the running three containers