#!/bin/bash
set -e

# Function to wait for service to be ready
wait_for_service() {
  local host=$1
  local port=$2
  local max_retry=30
  local counter=0

  echo "⏳ Waiting for $host:$port..."
  while ! nc -z $host $port >/dev/null 2>&1 && [ $counter -lt $max_retry ]; do
    sleep 2
    counter=$((counter+1))
    echo "Attempt $counter/$max_retry for $host:$port..."
  done

  if [ $counter -eq $max_retry ]; then
    echo "❌ Service $host:$port not reachable after $max_retry attempts"
    exit 1
  fi
  echo "✅ $host:$port is ready"
}

echo "=== 🧼 Cleaning and Building Java Chaincode ==="
cd /healthchaincode
mvn clean package

echo "=== 🗃️ Preparing chaincode directory ==="
CHAINCODE_DIR=/healthchaincode/mycc
mkdir -p "$CHAINCODE_DIR"
cp target/healthchaincode-0.0.1-SNAPSHOT.jar "$CHAINCODE_DIR/chaincode.jar"

echo "=== ♻️ Restarting Fabric Network ==="
cd /fabric-samples/test-network
./network.sh down || true
docker volume prune -f || true

echo "=== 🛠️ Setting Environment Variables ==="
export PATH=${PWD}/../bin:$PATH
export FABRIC_CFG_PATH=${PWD}/../config/
export CORE_PEER_TLS_ENABLED=true

./network.sh up createChannel -c mychannel -ca || {
  echo "❌ Failed to start Fabric network"
  exit 1
}

echo "=== ⏳ Waiting for Fabric services to be ready ==="
wait_for_service peer0.org1.example.com 7051
wait_for_service peer0.org2.example.com 9051
wait_for_service orderer.example.com 7050



CHAINCODE_NAME="mycc"
CHAINCODE_LABEL="mycc_1"
CHAINCODE_VERSION="1.0"
CHAINCODE_SEQUENCE=1
CHAINCODE_LANG="java"
CHAINCODE_PATH=/healthchaincode/mycc

echo "=== 📦 Packaging Chaincode ==="
peer lifecycle chaincode package ${CHAINCODE_NAME}.tar.gz \
  --path "$CHAINCODE_PATH" \
  --lang "$CHAINCODE_LANG" \
  --label "$CHAINCODE_LABEL"

# Function to install chaincode with retries
install_chaincode_with_retry() {
  local max_retry=5
  local counter=0
  local success=0

  while [ $counter -lt $max_retry ] && [ $success -eq 0 ]; do
    if peer lifecycle chaincode install ${CHAINCODE_NAME}.tar.gz; then
      success=1
    else
      sleep 5
      counter=$((counter+1))
      echo "⚠️ Retrying chaincode install (attempt $counter/$max_retry)..."
    fi
  done

  if [ $success -eq 0 ]; then
    echo "❌ Failed to install chaincode after $max_retry attempts"
    exit 1
  fi
}

echo "=== 📥 Installing on Org1 ==="
export CORE_PEER_LOCALMSPID="Org1MSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
export CORE_PEER_ADDRESS=peer0.org1.example.com:7051

install_chaincode_with_retry

PACKAGE_ID=$(peer lifecycle chaincode queryinstalled | grep "$CHAINCODE_LABEL" | awk -F "[, ]+" '{print $3}')
echo "📦 Package ID: $PACKAGE_ID"

echo "=== 📥 Installing on Org2 ==="
export CORE_PEER_LOCALMSPID="Org2MSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp
export CORE_PEER_ADDRESS=peer0.org2.example.com:9051

install_chaincode_with_retry

echo "=== ✅ Approving for Org1 ==="
export CORE_PEER_LOCALMSPID="Org1MSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
export CORE_PEER_ADDRESS=peer0.org1.example.com:7051  # Docker service name

peer lifecycle chaincode approveformyorg \
  --orderer orderer.example.com:7050  # Docker service name \
  --channelID mychannel \
  --name "$CHAINCODE_NAME" \
  --version "$CHAINCODE_VERSION" \
  --package-id "$PACKAGE_ID" \
  --sequence "$CHAINCODE_SEQUENCE" \
  --signature-policy "AND('Org1MSP.member', 'Org2MSP.member')" \
  --tls \
  --cafile ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem

echo "=== ✅ Approving for Org2 ==="
export CORE_PEER_LOCALMSPID="Org2MSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp
export CORE_PEER_ADDRESS=peer0.org2.example.com:9051  # Docker service name

peer lifecycle chaincode approveformyorg \
  --orderer orderer.example.com:7050  # Docker service name \
  --channelID mychannel \
  --name "$CHAINCODE_NAME" \
  --version "$CHAINCODE_VERSION" \
  --package-id "$PACKAGE_ID" \
  --sequence "$CHAINCODE_SEQUENCE" \
  --signature-policy "AND('Org1MSP.member', 'Org2MSP.member')" \
  --tls \
  --cafile ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem

echo "=== 🚀 Committing Chaincode ==="
export CORE_PEER_LOCALMSPID="Org1MSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
export CORE_PEER_ADDRESS=peer0.org1.example.com:7051  # Docker service name

peer lifecycle chaincode commit \
  --orderer orderer.example.com:7050  # Docker service name \
  --channelID mychannel \
  --name "$CHAINCODE_NAME" \
  --version "$CHAINCODE_VERSION" \
  --sequence "$CHAINCODE_SEQUENCE" \
  --signature-policy "AND('Org1MSP.member', 'Org2MSP.member')" \
  --tls \
  --cafile ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem \
  --peerAddresses peer0.org1.example.com:7051  # Docker service name \
  --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt \
  --peerAddresses peer0.org2.example.com:9051  # Docker service name \
  --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt

echo "=== 🔍 Querying Committed Chaincode ==="
peer lifecycle chaincode querycommitted --channelID mychannel --name "$CHAINCODE_NAME"

echo "✅ Chaincode deployment complete."
