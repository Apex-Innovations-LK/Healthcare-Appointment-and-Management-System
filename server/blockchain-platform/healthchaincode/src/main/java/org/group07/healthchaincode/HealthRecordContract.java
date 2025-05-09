package org.group07.healthchaincode;

import com.google.gson.Gson;
import org.hyperledger.fabric.contract.Context;
import org.hyperledger.fabric.contract.ContractInterface;
import org.hyperledger.fabric.contract.annotation.*;
import org.hyperledger.fabric.shim.ChaincodeException;
import org.hyperledger.fabric.shim.ChaincodeStub;
import org.hyperledger.fabric.shim.ledger.KeyModification;
import org.hyperledger.fabric.shim.ledger.QueryResultsIterator;
import org.hyperledger.fabric.shim.ledger.KeyValue;

import java.util.ArrayList;
import java.util.List;

@Contract(name = "HealthRecordContract", info = @Info(title = "Health Record Chaincode", description = "Chaincode to manage health records using IPFS hash and metadata", version = "2.0"))
@Default
public class HealthRecordContract implements ContractInterface {

    private final Gson gson = new Gson();

    static class HealthRecord {
        public String recordId;
        public String patientId;
        public String doctorId;
        public String ipfsHash;
    }

    private void assertOrg(Context ctx, String expectedMspId) {
        String actualMspId = ctx.getClientIdentity().getMSPID();
        if (!actualMspId.equals(expectedMspId)) {
            throw new ChaincodeException("Access denied for MSP: " + actualMspId);
        }
    }

    @Transaction(intent = Transaction.TYPE.SUBMIT)
    public void registerHealthRecord(Context ctx, String recordId, String patientId, String doctorId, String ipfsHash) {
        assertOrg(ctx, "Org1MSP");

        ChaincodeStub stub = ctx.getStub();
        if (!stub.getStringState(recordId).isEmpty()) {
            throw new ChaincodeException("Health record already exists with ID: " + recordId);
        }

        HealthRecord record = new HealthRecord();
        record.recordId = recordId;
        record.patientId = patientId;
        record.doctorId = doctorId;
        record.ipfsHash = ipfsHash;

        stub.putStringState(recordId, gson.toJson(record));
    }

    @Transaction(intent = Transaction.TYPE.EVALUATE)
    public String queryHealthRecord(Context ctx, String recordId) {
        ChaincodeStub stub = ctx.getStub();
        String recordJson = stub.getStringState(recordId);

        if (recordJson == null || recordJson.isEmpty()) {
            throw new ChaincodeException("No health record found with ID: " + recordId);
        }

        HealthRecord record = gson.fromJson(recordJson, HealthRecord.class);
        String mspId = ctx.getClientIdentity().getMSPID();
        String callerId = ctx.getClientIdentity().getId();

        if (mspId.equals("Org1MSP")) {
            return recordJson;
        } else if (mspId.equals("Org2MSP")) {
            if (!callerId.contains(record.patientId)) {
                throw new ChaincodeException("Unauthorized: Cannot view another patient's record.");
            }
            return recordJson;
        } else {
            throw new ChaincodeException("Unknown MSP: " + mspId);
        }
    }

    @Transaction(intent = Transaction.TYPE.EVALUATE)
    public String queryRecordsByPatient(Context ctx, String patientId) {
        ChaincodeStub stub = ctx.getStub();
        String mspId = ctx.getClientIdentity().getMSPID();
        String callerId = ctx.getClientIdentity().getId();

        if (mspId.equals("Org2MSP") && !callerId.contains(patientId)) {
            throw new ChaincodeException("Unauthorized: Patients can only query their own records.");
        }

        List<HealthRecord> results = new ArrayList<>();
        QueryResultsIterator<KeyValue> iter = null;

        try {
            iter = stub.getStateByRange("", "");
            for (KeyValue kv : iter) {
                HealthRecord record = gson.fromJson(kv.getStringValue(), HealthRecord.class);
                if (record.patientId.equals(patientId)) {
                    results.add(record);
                }
            }
        } catch (Exception e) {
            throw new ChaincodeException("Error while querying patient records: " + e.getMessage());
        } finally {
            if (iter != null) {
                try {
                    iter.close();
                } catch (Exception e) {
                    throw new ChaincodeException("Error closing iterator: " + e.getMessage());
                }
            }
        }

        return gson.toJson(results);
    }

    @Transaction(intent = Transaction.TYPE.SUBMIT)
    public void updateHealthRecord(Context ctx, String recordId, String ipfsHash) {
        assertOrg(ctx, "Org1MSP");

        ChaincodeStub stub = ctx.getStub();
        String recordJson = stub.getStringState(recordId);

        if (recordJson == null || recordJson.isEmpty()) {
            throw new ChaincodeException("No health record found with ID: " + recordId);
        }

        HealthRecord record = gson.fromJson(recordJson, HealthRecord.class);
        record.ipfsHash = ipfsHash;

        stub.putStringState(recordId, gson.toJson(record));
    }

    @Transaction(intent = Transaction.TYPE.SUBMIT)
    public void deleteHealthRecord(Context ctx, String recordId) {
        assertOrg(ctx, "Org1MSP");

        ChaincodeStub stub = ctx.getStub();
        String recordJson = stub.getStringState(recordId);

        if (recordJson == null || recordJson.isEmpty()) {
            throw new ChaincodeException("No health record found with ID: " + recordId);
        }

        stub.delState(recordId);
    }

    @Transaction(intent = Transaction.TYPE.EVALUATE)
    public String getRecordHistory(Context ctx, String recordId) {
        ChaincodeStub stub = ctx.getStub();
        List<String> historyJson = new ArrayList<>();

        try {
            for (KeyModification mod : stub.getHistoryForKey(recordId)) {
                String json = String.format(
                        "{\"txId\":\"%s\",\"timestamp\":\"%s\",\"isDeleted\":%s,\"value\":%s}",
                        mod.getTxId(),
                        mod.getTimestamp().toString(),
                        mod.isDeleted(),
                        mod.isDeleted() ? "null" : mod.getStringValue());
                historyJson.add(json);
            }
        } catch (Exception e) {
            throw new ChaincodeException("Error fetching history for record " + recordId + ": " + e.getMessage());
        }

        return "[" + String.join(",", historyJson) + "]";
    }
}