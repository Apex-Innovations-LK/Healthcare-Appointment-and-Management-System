1. Go to the "service-auth" directory through the terminal

2. - Windows - `mvnw clean package -DskipTests`
   - Ubuntu - `mvn clean package -DskipTests`

3. Convert both .env.txt files to .env files in ./ and ./docker directories

4. `docker build -t auth-microservice .` - build the image

5. `docker-compose up -d` - run the auth service, kafka & zookeeper

6. `docker-compose down` - stop the running three containers