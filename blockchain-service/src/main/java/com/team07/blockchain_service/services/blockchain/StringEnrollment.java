package com.team07.blockchain_service.services.blockchain;

import org.hyperledger.fabric.sdk.Enrollment;

import java.security.PrivateKey;

public class StringEnrollment implements Enrollment {

    private final String cert;
    private final PrivateKey privateKey;

    public StringEnrollment(String cert, PrivateKey privateKey) {
        this.cert = cert;
        this.privateKey = privateKey;
    }

    @Override
    public PrivateKey getKey() {
        return privateKey;
    }

    @Override
    public String getCert() {
        return cert;
    }
}
