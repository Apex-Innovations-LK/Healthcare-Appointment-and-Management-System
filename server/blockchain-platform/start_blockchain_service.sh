#!/bin/bash

set -e  
cd "$(dirname "$0")"  

find . -type f -name "*.sh" -exec chmod +x {} \;

chmod +x ./fabric-samples/bin/*
export PATH=$PATH:./fabric-samples/bin

echo "🔨 Building Spring Boot service..."
cd blockchain-service
mvn clean package -DskipTests
cd ..

echo "📦 Deploying chaincode..."
chmod +x ./deploy_mycc.sh
chmod +x ./interact_chaincode.sh

./deploy_mycc.sh

echo "🚀 Starting blockchain-service..."
java -jar blockchain-service/target/hyperledger-service-0.0.1-SNAPSHOT.jar

