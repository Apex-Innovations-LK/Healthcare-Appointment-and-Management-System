package com.team07.blockchain_service.services.blockchain;

import org.hyperledger.fabric.sdk.Enrollment;
import org.hyperledger.fabric.sdk.User;

import java.security.PrivateKey;

import java.util.Set;

public class FileSystemUser implements User {

    private final String name;
    private final String mspId;
    private final Enrollment enrollment;

    public FileSystemUser(String name, String mspId, String cert, PrivateKey privateKey) {
        this.name = name;
        this.mspId = mspId;
        this.enrollment = new StringEnrollment(cert, privateKey);
    }
    

    @Override
    public String getName() {
        return name;
    }

    @Override
    public Set<String> getRoles() {
        return null;
    }

    @Override
    public String getAccount() {
        return null;
    }

    @Override
    public String getAffiliation() {
        return null;
    }

    @Override
    public Enrollment getEnrollment() {
        return enrollment;
    }

    @Override
    public String getMspId() {
        return mspId;
    }
}
