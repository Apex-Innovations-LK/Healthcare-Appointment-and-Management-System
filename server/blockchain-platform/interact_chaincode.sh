#!/bin/bash
set -e

cd ~/Desktop/blockchain-platform/fabric-samples/test-network

export PATH=${PWD}/../bin:$PATH
export FABRIC_CFG_PATH=${PWD}/../config/
export CORE_PEER_TLS_ENABLED=true

# Default to Org1 (Hospital)
export CORE_PEER_LOCALMSPID="Org1MSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
export CORE_PEER_ADDRESS=localhost:7051

# --- Function Definitions ---

register_health_record() {
  peer chaincode invoke \
    -o localhost:7050 \
    --ordererTLSHostnameOverride orderer.example.com \
    --tls \
    --cafile ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem \
    -C mychannel \
    -n mycc \
    --peerAddresses localhost:7051 \
    --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt \
    --peerAddresses localhost:9051 \
    --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt \
    -c "{\"function\":\"registerHealthRecord\",\"Args\":[\"$record_id\",\"$patient_id\",\"$doctor_id\",\"$ipfs_hash\"]}"
  echo "✅ Health record registered."
}

query_health_record() {
  peer chaincode query \
    -C mychannel \
    -n mycc \
    -c "{\"function\":\"queryHealthRecord\",\"Args\":[\"$record_id\"]}"
}

update_health_record() {
  peer chaincode invoke \
    -o localhost:7050 \
    --ordererTLSHostnameOverride orderer.example.com \
    --tls \
    --cafile ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem \
    -C mychannel \
    -n mycc \
    --peerAddresses localhost:7051 \
    --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt \
    --peerAddresses localhost:9051 \
    --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt \
    -c "{\"function\":\"updateHealthRecord\",\"Args\":[\"$record_id\",\"$patient_id\",\"$doctor_id\",\"$ipfs_hash\"]}"
  echo "🔄 Health record updated."
}

delete_health_record() {
  peer chaincode invoke \
    -o localhost:7050 \
    --ordererTLSHostnameOverride orderer.example.com \
    --tls \
    --cafile ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem \
    -C mychannel \
    -n mycc \
    --peerAddresses localhost:7051 \
    --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt \
    --peerAddresses localhost:9051 \
    --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt \
    -c "{\"function\":\"deleteHealthRecord\",\"Args\":[\"$record_id\"]}"
  echo "🗑️ Record deleted (but history is preserved)."
}

query_audit_trail() {
  peer chaincode query \
    -C mychannel \
    -n mycc \
    -c "{\"function\":\"getRecordHistory\",\"Args\":[\"$record_id\"]}"
}

query_by_patient() {
  peer chaincode query \
    -C mychannel \
    -n mycc \
    -c "{\"function\":\"queryRecordsByPatient\",\"Args\":[\"$patient_id\"]}"
}

# --- CLI Mode (for Java calls) ---
if [ $# -gt 0 ]; then
  case "$1" in
    register)
      shift
      record_id="$1"; patient_id="$2"; doctor_id="$3"; ipfs_hash="$4"
      register_health_record
      ;;
    query)
      shift
      record_id="$1"
      query_health_record
      ;;
    update)
      shift
      record_id="$1"; patient_id="$2"; doctor_id="$3"; ipfs_hash="$4"
      update_health_record
      ;;
    delete)
      shift
      record_id="$1"
      delete_health_record
      ;;
    history)
      shift
      record_id="$1"
      query_audit_trail
      ;;
    by-patient)
      shift
      patient_id="$1"
      query_by_patient
      ;;
    *)
      echo "❌ Invalid CLI command."
      exit 1
      ;;
  esac
  exit 0
fi

# --- Interactive Mode (for manual use) ---

echo "Choose an action:"
echo "1) Register Health Record"
echo "2) Query Health Record"
echo "3) Update Health Record"
echo "4) Delete Health Record"
echo "5) Query Audit Trail"
echo "6) Query Records by Patient ID"

read -p "Enter your choice (1-6): " choice

case "$choice" in
  1)
    read -p "Record ID: " record_id
    read -p "Patient ID: " patient_id
    read -p "Doctor ID: " doctor_id
    read -p "IPFS Hash: " ipfs_hash
    register_health_record
    ;;
  2)
    read -p "Enter Record ID: " record_id
    query_health_record
    ;;
  3)
    read -p "Record ID: " record_id
    read -p "New Patient ID: " patient_id
    read -p "New Doctor ID: " doctor_id
    read -p "New IPFS Hash: " ipfs_hash
    update_health_record
    ;;
  4)
    read -p "Enter Record ID to delete: " record_id
    delete_health_record
    ;;
  5)
    read -p "Enter Record ID to get history: " record_id
    query_audit_trail
    ;;
  6)
    read -p "Enter Patient ID: " patient_id
    query_by_patient
    ;;
  *)
    echo "❌ Invalid choice."
    ;;
esac
