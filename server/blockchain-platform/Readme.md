# Untitled

# Blockchain Platform

A fully integrated and semi-automated blockchain-based healthcare records platform using Hyperledger Fabric and Spring Boot.

## 📦 Components

- `blockchain-service/`: Spring Boot service for interacting with the Hyperledger Fabric network
- `healthchaincode/`: Java chaincode (smart contract) implementation
- `fabric-samples/`: Hyperledger Fabric binaries and test network
- `deploy_mycc.sh`: Script to deploy chaincode onto the Fabric test network
- `interact_chaincode.sh`: Script to invoke functions in chaincode
- `start_blockchain_service.sh`: Script to build the service, deploy chaincode, and run the backend

---

## 🚀 Quick Start

### Prerequisites

- Java 21+
- Maven (or use the included `mvnw`)
- Hyperledger Fabric binaries (already inside `fabric-samples/`)
- (Optional) IPFS service running from the related `ipfs-service` directory
- jq

    ```bash
    sudo apt install jq

    ```
   
---

### 1. Clone the repository and enter the platform

```bash
git clone https://github.com/Apex-Innovations-LK/Healthcare-Appointment-and-Management-System.git
cd Healthcare-Appointment-and-Management-System/server/blockchain-platform

```

---

### 2. Start the Platform

```bash
./start_blockchain_service.sh

```

This script will:

- Build the Spring Boot application
- Deploy the Java chaincode to the test network
- Start the `blockchain-service` backend

---

## 🛠 Project Structure

```
blockchain-platform/
├── blockchain-service/       # Spring Boot backend
├── healthchaincode/          # Java chaincode logic
├── fabric-samples/           # Fabric binaries and test network
├── deploy_mycc.sh            # Chaincode deployment script
├── interact_chaincode.sh     # Chaincode invoke script
└── start_blockchain_service.sh  # All-in-one startup script

```

---

## 🔁 Stopping the Network

You can shut the fabric network down by running:

```bash
cd fabric-samples/test-network
./network.sh down

```

---

## 🔍 Logs and Debugging

- **Blockchain service logs** will appear in your terminal (from the `java -jar` command).
- **Chaincode logs** can be seen in Docker logs:
    
    ```bash
    docker logs dev-peer0.org1.example.com-healthchaincode-1.0
    
    ```
    
- **If you encounter the following error when starting the Spring Boot service:**
    
    ```
    Failed to connect to localhost/[0:0:0:0:0:0:0:1]:4317
    
    ```
    
    This is due to Spring Boot trying to auto-connect to an OpenTelemetry Collector on port `4317`. To suppress this error without modifying config files, simply run:
    
    ```bash
    docker run --rm -p 4317:4317 otel/opentelemetry-collector
    
    ```
    

---