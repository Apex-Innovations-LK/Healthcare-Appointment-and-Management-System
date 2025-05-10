# IPFS Service

A fully dockerized IPFS service implementation.

## Quick Start

### Prerequisites
- Docker

### Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/Apex-Innovations-LK/Healthcare-Appointment-and-Management-System.git
   cd ./Healthcare-Appointment-and-Management-System/server/ipfs-service
   ```

2. Build the Docker image:
   ```bash
   docker build -t ipfs-service .
   ```

3. Start the IPFS service:
   ```bash
   docker run -d \
     --name ipfs-service \
     -p 8085:8085 \
     -p 9092:9092 \
     -p 5001:5001 \
     -p 8095:8095 \
     -v ipfs-data:/data/ipfs \
     -v ipfs-export:/export \
     ipfs-service:latest
   ```

4. Verify the service is running:
   ```bash
   docker ps
   ```

### Stopping the Service
- Stop IPFS Service
    ```bash
    docker stop ipfs-service
    docker rm ipfs-service
    ```

## Configuration

Configuration is handled automatically within the Docker container.

## API Endpoints

### IPFS Core API
- Base URL: http://localhost:5001/api/v0
- Check IPFS version: 
  ```bash
  curl -X POST http://127.0.0.1:5001/api/v0/version
  ```

### Custom Service Endpoints
- Upload a file: 
  ```bash
  curl -X POST -F "file=@./yourfile.txt" http://127.0.0.1:8085/upload
  ```
- Access a file by CID:
  ```bash
  curl -X GET http://127.0.0.1:8085/file/[CID]
  ```
  Example:
  ```bash
  curl -X GET http://127.0.0.1:8085/file/QmUkPg9t9uxY2BNJr1zKi9oZFa7R1FND6g1X8GdEruZa3K
  ```
- Batch file upload:
  ```bash
  curl -X POST -F "files=@./file1.txt" -F "files=@./file2.txt" http://127.0.0.1:8085/files/batch
  ```
### Usage Examples
- Example 1: Upload Health Record
  ```bash
  curl -X POST -H "Content-Type: application/json" -d '{
  "record_id": "HR-015",
  "patient_id": "PAT-71983",
  "patient_name": "Stacy Hogan",
  "patient_dob": "1974-07-24",
  "date_of_service": "2025-03-27T22:33:43.646343+0000",
  "referring_doctor": "DR-21419",
  "chief_complaint": [
    "Cough",
    "Blurred vision"
  ],
  "allergies": [
    "Eggs",
    "Other",
    "Latex"
  ],
  "medications": [
    "Metformin",
    "Amoxicillin",
    "Atorvastatin"
  ],
  "problem_list": [
    "Back Pain",
    "Asthma",
    "Other"
  ],
  "patient_sex": "Other",
  "address": "245 Johnny Route Apt. 872",
  "city": "Colombo",
  "state": "Western",
  "zip": "00700",
  "patient_phone": "0791170829",
  "lbf_data": [
    "LBF101:5.8",
    "LBF102:14.9",
    "LBF103:126/79"
  ],
  "his_data": [
    "HIS005",
    "HIS007"
  ]
  }' http://127.0.0.1:8085/upload 
  ```

- Example 2: Batch Load Files by CID
  ``` bash
  curl -X POST -H "Content-Type: application/json" -d '[
  "QmPRQY1DcyBCmohGj9GQY77iSSF2zYmA4Q9kshfzp3eWNd", 
  "QmaC2GdFNfU65M8dx44uWvQQEntKBKN6ZJghnLw2cM39FA", 
  "QmU593515WPjpXGet1rx3bPH4hsiMHjFfP1PBhSFJVauKs", 
  "QmUkPg9t9uxY2BNJr1zKi9oZFa7R1FND6g1X8GdEruZa3K"
  ]' http://127.0.0.1:8085/files/batch
  ```

## Troubleshooting

- If you encounter any issues, check the logs:
  ```bash
  docker logs ipfs-service
  ```

- To restart the service:
  ```bash
  docker restart ipfs-service
  ```

## Maintenance

### Update IPFS Service
1. Stop and remove the existing container:
   ```bash
   docker stop ipfs-service
   docker rm ipfs-service
   ```
2. Pull the latest code and rebuild:
   ```bash
   git pull
   docker build -t ipfs-service .
   ```
3. Start the service again with the command in the Getting Started section

### Data Persistence
Data is stored in Docker volumes (`ipfs-data` and `ipfs-export`) for persistence. No additional setup required.

## Port Reference
- 8085: File upload API
- 9092: Internal service port
- 5001: IPFS API
- 8095: Additional service port

## Support

For issues or questions, please open an issue in the repository.
