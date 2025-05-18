#!/bin/bash

set -e  # Exit immediately if any command fails
cd "$(dirname "$0")"  # Ensure we're in the blockchain-platform directory


echo "🔨 Building Spring Boot service..."
cd blockchain-service
./mvnw clean package -DskipTests
cd ..

echo "📦 Deploying chaincode..."
chmod +x ./deploy_mycc.sh
chmod +x ./interact_chaincode.sh

./deploy_mycc.sh

echo "🚀 Starting blockchain-service..."
java -jar blockchain-service/target/hyperledger-service-0.0.1-SNAPSHOT.jar

