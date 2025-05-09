package com.team07.blockchain_service.dto;

public class HealthRecordHashed {

    private String recordId;
    private String patientId;
    private String doctorId;
    private String ipfsHash;

    public HealthRecordHashed() {
    }

    public HealthRecordHashed(String recordId, String patientId, String doctorId, String ipfsHash) {
        this.recordId = recordId;
        this.patientId = patientId;
        this.doctorId = doctorId;
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

    public String getDoctorId() {
        return doctorId;
    }

    public void setDoctorId(String doctorId) {
        this.doctorId = doctorId;
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
                ", doctorId='" + doctorId + '\'' +
                ", ipfsHash='" + ipfsHash + '\'' +
                '}';
    }
}