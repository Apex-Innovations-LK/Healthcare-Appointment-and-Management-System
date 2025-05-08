 📨 Notification Microservice

This microservice handles **email notifications** for the Healthcare Appointment & Management System project .

It uses:
- **Spring Boot (Java)** → Email Producer (Kafka Publisher)
- **FastAPI (Python)** → Email Consumer (Kafka Listener)
- **Kafka** → For event streaming
- **Docker Compose** → For containerizing and running all services together

---

## 📁 Folder Structure
Notification-Micro-Service/
├── emailproducer/ # Spring Boot producer
├── notification_service/ # FastAPI consumer
├── docker-compose.yml # To orchestrate services
└── .gitignore / .vscode # (Miscellaneous files)


**emailproducer/** → Publishes email notification requests to Kafka.  
**notification_service/** → Listens to Kafka and sends the emails.

---

## ⚙️ How to Run (For Local Development)

Make sure you have **Docker Desktop** running.

### Step-by-step:

```bash
# Navigate into the server directory
cd server

# Build all services
docker-compose build --no-cache

# Start all containers
docker-compose up -d
```

This will:

Start Zookeeper & Kafka

Build and run emailproducer (Spring Boot)

Build and run notification_service (FastAPI)

🚀 How It Works
Spring Boot (emailproducer):

Exposes an API /notify/send to accept email details (to, subject, body).

Publishes this data to a Kafka topic.

FastAPI (notification_service):

Listens to the Kafka topic.

Sends out the email using SMTP (settings are read from .env).




