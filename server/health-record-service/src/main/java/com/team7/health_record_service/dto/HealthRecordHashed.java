package com.team7.health_record_service.dto;

public class HealthRecordHashed {
    
    private String recordId;
    private String patientId;
    private String ipfsHash;

    public HealthRecordHashed() {
    }

    public HealthRecordHashed(String recordId, String patientId, String ipfsHash) {
        this.recordId = recordId;
        this.patientId = patientId;
        this.ipfsHash = ipfsHash;
    }

    public String getRecordId() {
        return recordId;
    }

    public void setRecordId(String recordId) {
        this.recordId = recordId;
    }

    public String getPatientId() {
        return patientId;
    }

    public void setPatientId(String patientId) {
        this.patientId = patientId;
    }

    public String getIpfsHash() {
        return ipfsHash;
    }

    public void setIpfsHash(String ipfsHash) {
        this.ipfsHash = ipfsHash;
    }

    @Override
    public String toString() {
        return "HashedRecord{" +
                "recordId='" + recordId + '\'' +
                ", patientId='" + patientId + '\'' +
                ", ipfsHash='" + ipfsHash + '\'' +
                '}';
    }
}
