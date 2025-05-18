# Health Analytics Service

A Spring Boot–based REST API for processing and visualizing healthcare data.  
Leverages Apache Spark for analytics, a Python/SciPy risk‐assessment script, and JSON data sources to provide:

- **Analytics**: patient counts, allergy & problem distributions  
- **Clinical Guidelines**: evaluate and recommend care rules per patient or condition  
- **Reports**: generate & export CSV or visualization data for custom filters  
- **Risk Assessment**: simple rules and SciPy‐powered probabilistic assessments  

---

## Table of Contents

1. [Prerequisites](#prerequisites)  
2. [Getting Started](#getting-started)  
3. [Configuration](#configuration)
4. [API Endpoints](#api-endpoints)  
5. [Python Risk Script](#python-risk-script)  

---

## Prerequisites

- **Java 17+** (JDK)  
- **Maven 3.8+**  
- **Python 3** with `numpy`, `scipy`  
- **git**  

---

## Getting Started

1. **Clone** the repo:  

    ```bash
   git clone https://github.com/your-org/health-analytics-service.git
   cd health-analytics-service/server/health-analytics
    ```

2. **Install** dependencies & build:

   ```bash
   mvn clean package
   ```

3. **Set** Python risk‐assessment script on `python/risk_assessment_scipy.py`

4. **Run** the application:

   ```bash
   mvn spring-boot:run
   ```

   Defaults to **port 8084**.

---

## Configuration

All configuration is in [`AppConfig`](src/main/java/com/team8/healthanalytics/config/AppConfig.java):

- **SparkSession** (local, 2 GB driver memory, Java 17 compatibility)
- **CORS** allows `http://localhost:4200`
- **ObjectMapper**, **RestTemplate** beans
- Clean shutdown of Spark on exit

*No external properties file required*.

---

## API Endpoints

### Analytics

- `GET /api/analytics`
  Returns `AnalyticsData` (patient‐count timeline, allergy/problem distributions).

### Clinical Guidelines

- `GET  /api/guidelines/raw/patients`
- `GET  /api/guidelines/raw/guidelines`
- `GET  /api/guidelines/evaluate-all`
- `POST /api/guidelines/evaluate` – body: `PatientRecord`
- `GET  /api/guidelines/{condition}`
- `GET  /api/guidelines/patient/{id}`

### Reports

- `POST /api/reports/generate` – body: `ReportRequest` → `ReportData`
- `POST /api/reports/export/csv` – export CSV
- `POST /api/reports/visualization-data` – JSON for charts

### Risk Assessment

- `GET  /api/risk-assessment` – all assessments
- `GET  /api/risk-assessment/{patientId}`
- `GET  /api/risk-assessment/patients` – raw patient list
- `POST /api/risk-assessment/batch` – list of IDs
- `GET  /api/risk-assessment/distribution`

*CORS is enabled on all report & risk‐assessment endpoints.*

---

## Python Risk Script

Located at `python/risk_assessment_scipy.py`.
Invoked by `RiskAssessmentService` to compute probabilistic risk:

```bash
python3 python/risk_assessment_scipy.py '{"blood_glucose":5.0, ...}'
```

Ensure `numpy` & `scipy` are installed:

```bash
pip3 install numpy scipy
```
