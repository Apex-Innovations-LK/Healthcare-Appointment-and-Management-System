#!/bin/bash
set -e

echo "=== 🧼 Cleaning and Building Java Chaincode ==="
cd /healthchaincode
mvn clean package

echo "=== 🗃️ Preparing chaincode directory ==="
CHAINCODE_DIR=/healthchaincode/mycc
mkdir -p "$CHAINCODE_DIR"
cp target/healthchaincode-0.0.1-SNAPSHOT.jar "$CHAINCODE_DIR/chaincode.jar"

echo "=== ♻️ Restarting Fabric Network ==="
cd /fabric-samples/test-network
./network.sh down
docker volume prune -f
./network.sh up createChannel -c mychannel -ca

echo "=== 🛠️ Setting Environment Variables ==="
export PATH=${PWD}/../bin:$PATH
export FABRIC_CFG_PATH=${PWD}/../config/
export CORE_PEER_TLS_ENABLED=true

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

echo "=== 📥 Installing on Org1 ==="
export CORE_PEER_LOCALMSPID="Org1MSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
export CORE_PEER_ADDRESS=localhost:7051

peer lifecycle chaincode install ${CHAINCODE_NAME}.tar.gz

PACKAGE_ID=$(peer lifecycle chaincode queryinstalled | grep "$CHAINCODE_LABEL" | awk -F "[, ]+" '{print $3}')
echo "📦 Package ID: $PACKAGE_ID"

echo "=== 📥 Installing on Org2 ==="
export CORE_PEER_LOCALMSPID="Org2MSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp
export CORE_PEER_ADDRESS=localhost:9051

peer lifecycle chaincode install ${CHAINCODE_NAME}.tar.gz

echo "=== ✅ Approving for Org1 ==="
export CORE_PEER_LOCALMSPID="Org1MSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
export CORE_PEER_ADDRESS=localhost:7051

peer lifecycle chaincode approveformyorg \
  --orderer localhost:7050 \
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
export CORE_PEER_ADDRESS=localhost:9051

peer lifecycle chaincode approveformyorg \
  --orderer localhost:7050 \
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
export CORE_PEER_ADDRESS=localhost:7051

peer lifecycle chaincode commit \
  --orderer localhost:7050 \
  --channelID mychannel \
  --name "$CHAINCODE_NAME" \
  --version "$CHAINCODE_VERSION" \
  --sequence "$CHAINCODE_SEQUENCE" \
  --signature-policy "AND('Org1MSP.member', 'Org2MSP.member')" \
  --tls \
  --cafile ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem \
  --peerAddresses localhost:7051 \
  --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt \
  --peerAddresses localhost:9051 \
  --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt

echo "=== 🔍 Querying Committed Chaincode ==="
peer lifecycle chaincode querycommitted --channelID mychannel --name "$CHAINCODE_NAME"

echo "✅ Chaincode deployment complete."
