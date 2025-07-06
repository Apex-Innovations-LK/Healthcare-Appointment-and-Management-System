# 🏥 Healthcare Appointment & Management System

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Java](https://img.shields.io/badge/Java-17-orange.svg)
![Angular](https://img.shields.io/badge/Angular-19-red.svg)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-green.svg)
![Docker](https://img.shields.io/badge/Docker-Containerized-blue.svg)
![Kafka](https://img.shields.io/badge/Apache%20Kafka-3.x-black.svg)

A comprehensive, enterprise-grade healthcare management platform built using modern microservices architecture. This system revolutionizes healthcare delivery by integrating appointment scheduling, AI-powered diagnostics, blockchain-secured health records, real-time communication, and advanced analytics into a unified, scalable platform.

## 🎯 Overview

The Healthcare Appointment & Management System is designed to address the complex needs of modern healthcare facilities, providing a robust, secure, and user-friendly platform for patients, healthcare providers, and administrators. Built with scalability and security in mind, the system leverages cutting-edge technologies to deliver superior healthcare experiences.

### Key Highlights

- **🔐 Enterprise Security**: JWT-based authentication with Spring Security
- **🌐 Microservices Architecture**: 10+ independent, loosely-coupled services
- **🤖 AI-Powered Diagnostics**: Machine learning integration for intelligent health insights
- **⛓️ Blockchain Integration**: Immutable health records with Hyperledger Fabric
- **📊 Real-time Analytics**: Advanced data visualization and reporting
- **🔄 Event-Driven Communication**: Apache Kafka for seamless service coordination
- **📱 Modern UI/UX**: Responsive Angular frontend with Tailwind CSS

---

## 📌 Table of Contents

- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [System Architecture](#-system-architecture)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage](#-usage)
- [Microservices Overview](#-microservices-overview)
- [API Documentation](#-api-documentation)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Monitoring](#-monitoring)
- [Contributing](#-contributing)
- [License](#-license)
- [Support](#-support)

---

## 🚀 Features

### Core Functionalities

#### 👥 User Management
- **Multi-role Authentication**: Patients, Doctors, Administrators, and Staff
- **Secure Registration/Login**: JWT-based authentication with refresh tokens
- **Profile Management**: Comprehensive user profiles with medical history
- **Role-based Access Control**: Fine-grained permissions system

#### 📅 Appointment Management
- **Smart Scheduling**: AI-powered appointment optimization
- **Conflict Resolution**: Automatic detection and resolution of scheduling conflicts
- **Multi-channel Booking**: Web, mobile, and phone booking support
- **Real-time Availability**: Live calendar synchronization
- **Appointment Reminders**: Email and SMS notifications

#### 🤖 AI-Powered Features
- **Diagnostic Assistance**: TensorFlow and Hugging Face integration
- **Predictive Analytics**: Health trend analysis and risk assessment
- **Symptom Checker**: Intelligent preliminary diagnosis
- **Treatment Recommendations**: Evidence-based care suggestions

#### ⛓️ Blockchain Integration
- **Immutable Health Records**: Hyperledger Fabric for secure data storage
- **IPFS Integration**: Decentralized file storage for medical documents
- **Smart Contracts**: Automated consent and data sharing agreements
- **Audit Trail**: Complete transaction history and data provenance

#### 💬 Communication Platform
- **Real-time Chat**: WebRTC-powered video consultations
- **Secure Messaging**: End-to-end encrypted communication
- **File Sharing**: Medical document and image sharing
- **Chat History**: Persistent conversation storage

#### 📊 Analytics & Reporting
- **Healthcare Analytics**: Apache Spark and SciPy integration
- **Custom Dashboards**: Real-time data visualization
- **Performance Metrics**: KPI tracking and reporting
- **Compliance Reports**: Regulatory compliance documentation

#### 🔄 Integration Capabilities
- **FHIR Compliance**: Healthcare interoperability standards
- **OpenEMR Integration**: Electronic medical records compatibility
- **Third-party APIs**: Insurance, pharmacy, and lab integrations
- **Import/Export**: Data migration and backup capabilities

---

## 🧰 Technology Stack

### Frontend Technologies
| Technology | Version | Purpose |
|------------|---------|---------|
| **Angular** | 19.x | Progressive web application framework |
| **TypeScript** | 5.x | Type-safe JavaScript development |
| **Tailwind CSS** | 3.x | Utility-first CSS framework |
| **PrimeNG** | 19.x | Rich UI component library |
| **Chart.js** | 4.x | Data visualization and charting |
| **Firebase** | 11.x | Real-time database and authentication |

### Backend Technologies
| Technology | Version | Purpose |
|------------|---------|---------|
| **Java** | 17 | Core backend programming language |
| **Spring Boot** | 3.x | Enterprise application framework |
| **Spring Security** | 6.x | Authentication and authorization |
| **Spring Cloud Gateway** | 4.x | API gateway and routing |
| **Maven** | 3.x | Dependency management and build tool |

### AI/ML Technologies
| Technology | Version | Purpose |
|------------|---------|---------|
| **Python** | 3.10+ | AI/ML service development |
| **TensorFlow** | 2.x | Machine learning framework |
| **Hugging Face** | Latest | Pre-trained model integration |
| **SciPy** | 1.x | Scientific computing library |
| **Apache Spark** | 3.x | Big data processing |

### Blockchain & Storage
| Technology | Version | Purpose |
|------------|---------|---------|
| **Hyperledger Fabric** | 2.x | Enterprise blockchain platform |
| **IPFS** | Latest | Distributed file system |
| **PostgreSQL** | 15 | Primary relational database |
| **Redis** | 7.x | In-memory data store and cache |

### Infrastructure & DevOps
| Technology | Version | Purpose |
|------------|---------|---------|
| **Docker** | Latest | Containerization platform |
| **Apache Kafka** | 3.x | Event streaming platform |
| **GitHub Actions** | Latest | CI/CD pipeline |
| **Kubernetes** | 1.x | Container orchestration (optional) |

---

## 🏗️ System Architecture

### Microservices Architecture Overview

The system follows a distributed microservices architecture pattern, ensuring scalability, maintainability, and fault tolerance.

```
┌─────────────────────────────────────────────────────────────────┐
│                          Load Balancer                          │
└─────────────────────────────────────────────────────────────────┘
                                  │
┌─────────────────────────────────────────────────────────────────┐
│                        API Gateway                              │
│                    (Spring Cloud Gateway)                       │
└─────────────────────────────────────────────────────────────────┘
                                  │
        ┌─────────────────────────┼─────────────────────────┐
        │                         │                         │
┌───────▼────────┐    ┌──────────▼──────────┐    ┌────────▼────────┐
│   Frontend     │    │   Authentication    │    │   Appointment   │
│   (Angular)    │    │     Service         │    │    Service      │
└────────────────┘    └─────────────────────┘    └─────────────────┘
                                  │
        ┌─────────────────────────┼─────────────────────────┐
        │                         │                         │
┌───────▼────────┐    ┌──────────▼──────────┐    ┌────────▼────────┐
│   Chat         │    │   Health Analytics  │    │   Blockchain    │
│   Service      │    │     Service         │    │    Service      │
└────────────────┘    └─────────────────────┘    └─────────────────┘
                                  │
        ┌─────────────────────────┼─────────────────────────┐
        │                         │                         │
┌───────▼────────┐    ┌──────────▼──────────┐    ┌────────▼────────┐
│   IPFS         │    │   Resource Manager  │    │   WebRTC        │
│   Service      │    │     Service         │    │    Service      │
└────────────────┘    └─────────────────────┘    └─────────────────┘
                                  │
                    ┌─────────────▼─────────────┐
                    │     Apache Kafka         │
                    │   (Event Streaming)      │
                    └──────────────────────────┘
```

### Design Patterns & Principles

- **Microservices Pattern**: Independent, deployable services
- **Event-Driven Architecture**: Asynchronous communication via Kafka
- **CQRS**: Command Query Responsibility Segregation
- **API Gateway Pattern**: Centralized request routing and cross-cutting concerns
- **Circuit Breaker**: Fault tolerance and resilience
- **Database per Service**: Data isolation and autonomy

---

## 📋 Prerequisites

Before setting up the Healthcare Appointment & Management System, ensure you have the following installed:

### Required Software
- **Java Development Kit (JDK)** 17 or higher
- **Node.js** 18.x or higher
- **npm** 8.x or higher
- **Docker** 20.x or higher
- **Docker Compose** 2.x or higher
- **Git** 2.x or higher

### Optional (for development)
- **Maven** 3.8+ (if not using Docker)
- **Python** 3.10+ (for AI services)
- **PostgreSQL** 15+ (if running without Docker)
- **Redis** 7.x (if running without Docker)

### System Requirements
- **RAM**: 8GB minimum, 16GB recommended
- **Storage**: 10GB free space
- **CPU**: 4 cores minimum, 8 cores recommended
- **Network**: Stable internet connection for Docker images

---

## 🛠️ Installation

### Quick Start with Docker (Recommended)

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/Healthcare-Appointment-and-Management-System.git
   cd Healthcare-Appointment-and-Management-System
   ```

2. **Start All Services**
   ```bash
   # Build and start all services
   docker-compose up --build
   
   # Or run in detached mode
   docker-compose up -d --build
   ```

3. **Access the Application**
   - **Frontend**: http://localhost:4200
   - **API Gateway**: http://localhost:8080
   - **Kafka UI**: http://localhost:9021 (if enabled)

### Manual Installation

#### Backend Services

1. **Navigate to Server Directory**
   ```bash
   cd server
   ```

2. **Build All Services**
   ```bash
   mvn clean install
   ```

3. **Start Individual Services**
   ```bash
   # Start API Gateway
   cd api-gateway
   mvn spring-boot:run
   
   # Start Appointment Service
   cd ../appointment_service
   mvn spring-boot:run
   
   # Repeat for other services...
   ```

#### Frontend Application

1. **Navigate to Client Directory**
   ```bash
   cd client
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Development Server**
   ```bash
   npm start
   ```

---

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=healthcare_db
DB_USERNAME=admin
DB_PASSWORD=password

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Kafka Configuration
KAFKA_BOOTSTRAP_SERVERS=localhost:9092
KAFKA_GROUP_ID=healthcare-group

# JWT Configuration
JWT_SECRET=your-secret-key-here
JWT_EXPIRATION=3600000

# Firebase Configuration
FIREBASE_API_KEY=your-firebase-api-key
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_PROJECT_ID=your-project-id

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Blockchain Configuration
HYPERLEDGER_PEER_ADDRESS=localhost:7051
HYPERLEDGER_ORDERER_ADDRESS=localhost:7050
IPFS_API_URL=http://localhost:5001
```

### Service-Specific Configuration

Each microservice has its own `application.yml` or `application.properties` file for specific configurations. Refer to individual service documentation for detailed configuration options.

---

## 🚀 Usage

### User Roles and Workflows

#### Patient Workflow
1. **Registration**: Create account with basic information
2. **Profile Setup**: Complete medical history and preferences
3. **Appointment Booking**: Search and book appointments with doctors
4. **Consultation**: Attend video consultations or in-person visits
5. **Records Access**: View medical records and test results

#### Doctor Workflow
1. **Registration**: Professional registration with credentials
2. **Schedule Management**: Set availability and working hours
3. **Appointment Handling**: Accept, reschedule, or cancel appointments
4. **Patient Consultation**: Conduct consultations and update records
5. **Analytics**: Review patient data and performance metrics

#### Administrator Workflow
1. **System Management**: Monitor system health and performance
2. **User Management**: Manage user accounts and permissions
3. **Analytics**: Generate reports and insights
4. **Configuration**: Update system settings and parameters

### API Usage Examples

#### Authentication
```bash
# Register a new user
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "role": "PATIENT"
  }'

# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

#### Appointment Management
```bash
# Book an appointment
curl -X POST http://localhost:8080/api/appointments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "doctorId": "123",
    "patientId": "456",
    "dateTime": "2024-12-25T10:00:00",
    "type": "CONSULTATION"
  }'
```

---

## 🔬 Microservices Overview

### Service Architecture Details

#### 🔐 Authentication Service (`service-auth`)
- **Purpose**: Centralized authentication and authorization
- **Port**: 8081
- **Key Features**:
  - JWT token generation and validation
  - Role-based access control
  - Password encryption and security
  - OAuth2 integration support

#### 📅 Appointment Service (`appointment_service`)
- **Purpose**: Appointment scheduling and management
- **Port**: 8082
- **Key Features**:
  - Smart scheduling algorithms
  - Conflict detection and resolution
  - Calendar synchronization
  - Reminder notifications

#### 🩺 Schedule Service (`service-schedule`)
- **Purpose**: Doctor schedule and availability management
- **Port**: 8083
- **Key Features**:
  - Availability management
  - Working hours configuration
  - Holiday and leave management
  - Slot optimization

#### 💬 Chat Service (`chat-service`)
- **Purpose**: Real-time messaging and communication
- **Port**: 8084
- **Key Features**:
  - WebSocket-based real-time messaging
  - File sharing capabilities
  - Message encryption
  - Chat history persistence

#### 📊 Health Analytics Service (`health-analytics`)
- **Purpose**: Data analytics and insights
- **Port**: 8085
- **Key Features**:
  - Patient health trend analysis
  - Predictive analytics
  - Custom dashboard creation
  - Report generation

#### 🌐 IPFS Service (`ipfs-service`)
- **Purpose**: Decentralized file storage
- **Port**: 8086
- **Key Features**:
  - Medical document storage
  - Image and file management
  - Decentralized architecture
  - Content addressing

#### 🔗 API Gateway (`api-gateway`)
- **Purpose**: Request routing and cross-cutting concerns
- **Port**: 8080
- **Key Features**:
  - Request routing and load balancing
  - Authentication and authorization
  - Rate limiting and throttling
  - Request/response transformation

#### 🎥 WebRTC Service (`webrtc-service`)
- **Purpose**: Video consultation and communication
- **Port**: 8087
- **Key Features**:
  - Video call management
  - Screen sharing capabilities
  - Recording functionality
  - Quality optimization

#### 🏥 Resource Management Service (`resource-manage-service`)
- **Purpose**: Hospital resource and inventory management
- **Port**: 8088
- **Key Features**:
  - Equipment tracking
  - Room management
  - Inventory control
  - Resource allocation

#### ⛓️ Blockchain Platform (`blockchain-platform`)
- **Purpose**: Secure health record management
- **Port**: 8089
- **Key Features**:
  - Hyperledger Fabric integration
  - Smart contract management
  - Immutable record storage
  - Audit trail maintenance

---

## 📚 API Documentation

### OpenAPI/Swagger Documentation

Each microservice provides comprehensive API documentation through Swagger UI:

- **API Gateway**: http://localhost:8080/swagger-ui.html
- **Authentication Service**: http://localhost:8081/swagger-ui.html
- **Appointment Service**: http://localhost:8082/swagger-ui.html
- **Schedule Service**: http://localhost:8083/swagger-ui.html

### Common API Endpoints

#### Authentication Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | User authentication |
| POST | `/api/auth/refresh` | Refresh JWT token |
| POST | `/api/auth/logout` | User logout |

#### Appointment Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/appointments` | Get user appointments |
| POST | `/api/appointments` | Book new appointment |
| PUT | `/api/appointments/{id}` | Update appointment |
| DELETE | `/api/appointments/{id}` | Cancel appointment |

#### Schedule Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/schedules/doctor/{id}` | Get doctor schedule |
| POST | `/api/schedules` | Create schedule |
| PUT | `/api/schedules/{id}` | Update schedule |
| GET | `/api/schedules/availability` | Check availability |

---

## 🧪 Testing

### Running Tests

#### Backend Tests
```bash
# Run all tests
mvn test

# Run tests for specific service
cd server/appointment_service
mvn test

# Run integration tests
mvn verify
```

#### Frontend Tests
```bash
cd client
npm test

# Run e2e tests
npm run e2e

# Generate coverage report
npm run test:coverage
```

### Testing Strategy

- **Unit Tests**: Jest (Frontend), JUnit 5 (Backend)
- **Integration Tests**: Spring Boot Test, TestContainers
- **End-to-End Tests**: Cypress, Selenium
- **Performance Tests**: JMeter, Artillery
- **Security Tests**: OWASP ZAP, SonarQube

---

## 🚀 Deployment

### Docker Deployment

#### Production Environment
```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Deploy to production
docker-compose -f docker-compose.prod.yml up -d

# Scale services
docker-compose -f docker-compose.prod.yml up -d --scale appointment_service=3
```

#### Health Checks
```bash
# Check service health
docker-compose ps

# View logs
docker-compose logs -f [service_name]

# Monitor resource usage
docker stats
```

### Kubernetes Deployment

#### Prerequisites
- Kubernetes cluster (1.20+)
- kubectl configured
- Helm 3.x installed

#### Deployment Steps
```bash
# Create namespace
kubectl create namespace healthcare

# Deploy using Helm
helm install healthcare ./k8s/helm-chart -n healthcare

# Check deployment status
kubectl get pods -n healthcare

# Access services
kubectl port-forward svc/api-gateway 8080:8080 -n healthcare
```

### CI/CD Pipeline

The project includes GitHub Actions workflows for:
- **Continuous Integration**: Automated testing and code quality checks
- **Continuous Deployment**: Automated deployment to staging/production
- **Security Scanning**: Dependency and vulnerability scanning
- **Performance Testing**: Automated performance benchmarking

---

## 📊 Monitoring

### Application Monitoring

#### Metrics Collection
- **Micrometer**: Application metrics collection
- **Prometheus**: Metrics storage and querying
- **Grafana**: Visualization and dashboards
- **Zipkin**: Distributed tracing

#### Health Checks
```bash
# Check application health
curl http://localhost:8080/actuator/health

# View metrics
curl http://localhost:8080/actuator/metrics

# Check service info
curl http://localhost:8080/actuator/info
```

### Infrastructure Monitoring

#### Log Management
- **ELK Stack**: Elasticsearch, Logstash, Kibana
- **Centralized Logging**: Aggregated log collection
- **Log Analysis**: Pattern detection and alerting
- **Audit Logging**: Compliance and security monitoring

#### Performance Monitoring
- **APM Tools**: Application Performance Monitoring
- **Database Monitoring**: Query performance and optimization
- **Cache Monitoring**: Redis performance metrics
- **Network Monitoring**: Service communication analysis

---

## 🤝 Contributing

We welcome contributions from the community! Please follow these guidelines:

### Development Setup

1. **Fork the Repository**
   ```bash
   git clone https://github.com/your-username/Healthcare-Appointment-and-Management-System.git
   ```

2. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make Changes**
   - Follow coding standards
   - Add tests for new functionality
   - Update documentation

4. **Submit Pull Request**
   - Provide clear description
   - Include test coverage
   - Follow PR template

### Code Standards

#### Backend (Java)
- **Google Java Style Guide**
- **SonarQube Quality Gate**
- **Minimum 80% test coverage**
- **Javadoc for public APIs**

#### Frontend (TypeScript/Angular)
- **Angular Style Guide**
- **ESLint + Prettier**
- **TypeScript strict mode**
- **Component documentation**

### Contribution Types

- 🐛 **Bug Reports**: Report issues and bugs
- 💡 **Feature Requests**: Suggest new features
- 📖 **Documentation**: Improve documentation
- 🔧 **Code Improvements**: Refactoring and optimization
- 🧪 **Testing**: Add or improve tests
- 🎨 **UI/UX**: Design improvements

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2024 Healthcare Appointment & Management System

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🆘 Support

### Getting Help

- **📖 Documentation**: Check this README and inline documentation
- **🐛 Issues**: Report bugs and issues on GitHub
- **💬 Discussions**: Join community discussions
- **📧 Email**: Contact support team

### Community Resources

- **GitHub Repository**: [Healthcare-Appointment-and-Management-System](https://github.com/your-username/Healthcare-Appointment-and-Management-System)
- **Issue Tracker**: [GitHub Issues](https://github.com/your-username/Healthcare-Appointment-and-Management-System/issues)
- **Wiki**: [Project Wiki](https://github.com/your-username/Healthcare-Appointment-and-Management-System/wiki)

### Professional Support

For enterprise support, custom development, or consulting services, please contact:
- **Email**: support@healthcare-system.com
- **Website**: https://healthcare-system.com
- **LinkedIn**: [Project LinkedIn](https://linkedin.com/company/healthcare-system)

---

## 📈 Roadmap

### Version 2.0 (Q2 2025)
- [ ] **Mobile Application**: React Native mobile app
- [ ] **AI Chatbot**: Advanced patient support bot
- [ ] **Multi-language Support**: Internationalization
- [ ] **Advanced Analytics**: ML-powered insights

### Version 3.0 (Q4 2025)
- [ ] **IoT Integration**: Medical device connectivity
- [ ] **Blockchain Expansion**: Multi-chain support
- [ ] **Telemedicine Platform**: Enhanced video consultation
- [ ] **Insurance Integration**: Claims processing automation

### Long-term Vision
- [ ] **Global Deployment**: Multi-region support
- [ ] **Research Platform**: Clinical trial management
- [ ] **Public Health**: Population health analytics
- [ ] **Open Source Ecosystem**: Community-driven development

---

## 🙏 Acknowledgments

Special thanks to:
- **Open Source Community**: For the amazing tools and libraries
- **Healthcare Professionals**: For domain expertise and feedback
- **Contributors**: For their valuable contributions
- **Beta Testers**: For testing and feedback

---

**Built with ❤️ for better healthcare**

*For more information, visit our [website](https://healthcare-system.com) or contact us at support@healthcare-system.com*
