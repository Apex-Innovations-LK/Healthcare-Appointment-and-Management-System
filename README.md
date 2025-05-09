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




# 🏥 Healthcare Appointment & Management System

A modular, scalable, and secure healthcare management platform built using a layered + event-driven microservices architecture. Supports appointment scheduling, AI-based diagnostics, blockchain-powered health records, and analytics dashboards.

---

## 📌 Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [System Architecture](#system-architecture)
- [Getting Started](#getting-started)
- [Microservices Overview](#microservices-overview)
- [Screenshots / Demo](#screenshots--demo)
- [Folder Structure](#folder-structure)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)

---

## 🚀 Features

- ✅ Patient and doctor registration/login (JWT Auth)
- 📆 Appointment booking with schedule conflict resolution
- 🤖 AI-powered diagnostics using TensorFlow / Hugging Face
- 🔐 Blockchain-integrated health record storage via Hyperledger + IPFS
- 📊 Analytics dashboard using Apache Spark & SciPy
- 🔄 Event-driven communication via Apache Kafka
- 📤 Email/SMS appointment reminders
- 🌐 FHIR & OpenEMR interoperability

---

## 🧰 Technology Stack

| Layer         | Technologies |
|---------------|--------------|
| Frontend      | Angular 16, TypeScript, Tailwind CSS |
| Backend       | Java 17, Spring Boot 3, Spring Security |
| AI Services   | Python 3.10, TensorFlow, Hugging Face Transformers |
| Blockchain    | Hyperledger Fabric 2.x, Solidity, IPFS |
| Messaging     | Apache Kafka 3.x |
| Database      | PostgreSQL 15, Redis |
| DevOps        | Docker, GitHub Actions, Kubernetes (optional) |

---

## 🧱 System Architecture

- Microservices-based architecture
- Layered design (Controller → Service → Repository)
- Event-driven communication using Kafka
- RESTful APIs with OpenAPI (Swagger)

![Architecture Diagram](docs/architecture-diagram.png)

---

## 🛠️ Getting Started

```bash
# Clone the repository
git clone https://github.com/your-org/healthcare-system.git

# Navigate to project folder
cd healthcare-system

# Build and run using Docker Compose
docker-compose up --build
