# Resource Manage Service

This Spring Boot microservice provides resource management functionality for the Healthcare Appointment and Management System. It handles resource CRUD operations, resource allocations for sessions, and staff utilization metrics. It integrates with a Supabase PostgreSQL database and an Apache Kafka message broker.

---

## Table of Contents

* [Prerequisites](#prerequisites)
* [Configuration](#configuration)

  * [Database (Supabase)](#database-supabase)
  * [Kafka](#kafka)
  * [Application Properties](#application-properties)
* [Building the Application](#building-the-application)
* [Running Locally](#running-locally)
* [Running with Docker](#running-with-docker)
* [API Endpoints](#api-endpoints)

  * [ResourceController](#resourcecontroller)
  * [ResourceAllocationController](#resourceallocationcontroller)
  * [StaffAllocationController](#staffallocationcontroller)

---

## Prerequisites

* Java 17 (JDK 17)
* Maven 3.9+
* Docker & Docker Compose (if running in containers)
* Supabase (PostgreSQL) project or PostgreSQL database
* Apache Kafka & Zookeeper (for messaging integration)

---

## Configuration

### Database (Supabase)

This service uses Supabase’s PostgreSQL database. For best compatibility (IPv4), use the Supabase pooler endpoint:

```properties
spring.datasource.url=jdbc:postgresql://aws-0-<region>.pooler.supabase.com:5432/postgres?ssl=true&sslmode=require
spring.datasource.username=postgres.<project-ref>
spring.datasource.password=<your-db-password>
```

### Kafka

Kafka is used to consume scheduling events and produce resource and staff allocation messages. Configure Kafka bootstrap servers:

```properties
spring.kafka.bootstrap-servers=kafka:9092
spring.kafka.consumer.group-id=resource-manage-group
```

### Application Properties

All configurable properties are located in `src/main/resources/application.properties`. Environment variables can override them:

* `SPRING_DATASOURCE_URL`
* `SPRING_DATASOURCE_USERNAME`
* `SPRING_DATASOURCE_PASSWORD`
* `SPRING_KAFKA_BOOTSTRAP_SERVERS`

---

## Building the Application

```bash
cd server/resource-manage-service
./mvnw clean package -DskipTests
```

The build produces a fat JAR: `target/resource-manage-service-0.0.1-SNAPSHOT.jar`.

---

## Running Locally

Set the required environment variables and run:

```bash
export SPRING_DATASOURCE_URL=jdbc:postgresql://...pooler.supabase.com:5432/postgres?ssl=true&sslmode=require
export SPRING_DATASOURCE_USERNAME=postgres.<project-ref>
export SPRING_DATASOURCE_PASSWORD=<your-db-password>
export SPRING_KAFKA_BOOTSTRAP_SERVERS=localhost:9092

./mvnw spring-boot:run
```

The application starts on port **8087** by default.

---

## Running with Docker

Ensure Docker and Docker Compose are installed. From the project root:

```bash
docker compose up --build
```

This will start:

* **resource-manage-service** (port 8087)
* **kafka** (port 9092)
* **zookeeper** (port 2181)

Set your environment variables in `docker-compose.yml` under the `resource-manage-service` service.

---

## API Endpoints

### ResourceController

| Method | Endpoint              | Description           |
| ------ | --------------------- | --------------------- |
| GET    | `/api/resource/all`       | List all resources    |
| POST   | `/api/resource/add`       | Create a new resource |
| GET    | `/api/resource/find/{id}` | Get a resource by ID  |

### ResourceAllocationController

| Method | Endpoint                                               | Description                               |
| ------ | ------------------------------------------------------ | ----------------------------------------- |
| GET    | `/api/resource-allocation/all`                         | List all session allocations              |
| GET    | `/api/resource-allocation/find/{sessionId}`            | Get allocation details by session ID      |
| GET    | `/api/resource-allocation/upcoming/{resourceId}`     | Get upcoming allocations for a resource   |
| GET    | `/api/resource-allocation/busy/{from}/{to}`           | List busy resource IDs between timestamps |
| GET    | `/api/resource-allocation/available/{from}/{to}`      | Get available rooms & equipment           |
| POST   | `/api/resource-allocation/add`                             | Add a new resource allocation             |
| DELETE | `/api/resource-allocation/delete/{sessionId}/{resourceId}` | Delete an allocation entry                |

### StaffAllocationController

| Method | Endpoint                       | Description                         |
| ------ | ------------------------------ | ----------------------------------- |
| GET    | `/api/resource/staff-utilization/overall`   | Get overall staff utilization stats |
| GET    | `/api/resource/staff-utilization/all`       | List all staff allocations          |
| GET    | `/api/resource/staff-utilization/find/{id}` | Get staff allocation by ID          |
