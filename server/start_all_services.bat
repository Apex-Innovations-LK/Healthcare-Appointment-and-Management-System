@echo off
echo Starting all Healthcare microservices...

REM Start API Gateway
start cmd /k "cd api-gateway && mvn spring-boot:run"

REM Start Authentication Service
start cmd /k "cd service-auth && mvn spring-boot:run"

REM Start Appointment Service
start cmd /k "cd appointment_service && mvn spring-boot:run"

REM Start Chat Service
start cmd /k "cd chat-service && mvn spring-boot:run"

REM Start Health Analytics
start cmd /k "cd health-analytics && mvn spring-boot:run"

REM Start IPFS Service
start cmd /k "cd ipfs-service && mvn spring-boot:run"

REM Start Doctor Service
start cmd /k "cd Microservice-Doctor/springboot-kafka-project && mvn spring-boot:run"

REM Start Resource Management Service
start cmd /k "cd resource-manage-service && mvn spring-boot:run"

REM Start Schedule Service
start cmd /k "cd service-schedule && mvn spring-boot:run"

REM Start WebRTC Service
start cmd /k "cd webrtc-service && mvn spring-boot:run"

echo All services are starting. Check individual windows for status.