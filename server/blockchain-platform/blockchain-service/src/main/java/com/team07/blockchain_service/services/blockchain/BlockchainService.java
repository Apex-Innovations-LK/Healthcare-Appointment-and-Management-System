// package com.team07.blockchain_service.services.blockchain;

// import com.team07.blockchain_service.dto.HealthRecordHashed;
// import org.hyperledger.fabric.sdk.*;
// import org.hyperledger.fabric.sdk.security.CryptoSuite;
// import org.springframework.stereotype.Service;

// import java.io.File;
// import java.nio.file.Files;
// // import java.nio.file.Paths;
// import java.util.Collection;
// import java.util.Properties;

// import java.io.StringReader;
// import java.security.Security;
// import java.security.PrivateKey;
// import org.bouncycastle.openssl.PEMParser;
// import org.bouncycastle.openssl.jcajce.JcaPEMKeyConverter;
// import org.bouncycastle.asn1.pkcs.RSAPrivateKey;
// import org.bouncycastle.asn1.pkcs.PrivateKeyInfo;
// //import org.bouncycastle.asn1.ASN1Primitive;
// import org.bouncycastle.asn1.ASN1Sequence;
// import org.bouncycastle.jce.provider.BouncyCastleProvider;


// @Service
// public class BlockchainService {

//     private final String channelName = "mychannel";
//     private final String chaincodeName = "mycc";
//     private final String ordererUrl = "grpcs://localhost:7050";
//     private final String peerUrl = "grpcs://localhost:7051";
//     private final String mspId = "Org1MSP";

//     private final String tlsCertPath = "/home/damindu/Desktop/blockchain-platform/fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt";

//     private final String cryptoPath = "/home/damindu/Desktop/blockchain-platform/fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp/";
//     private final HFClient hfClient;
//     private final Channel channel;

//     public BlockchainService() throws Exception {
//         hfClient = HFClient.createNewInstance();
//         hfClient.setCryptoSuite(CryptoSuite.Factory.getCryptoSuite());
//         hfClient.setUserContext(getUserContext());

//         channel = hfClient.newChannel(channelName);
//         Orderer orderer = hfClient.newOrderer("orderer.example.com", ordererUrl, getTlsProperties());
//         channel.addOrderer(orderer);

//         Peer peer = hfClient.newPeer("peer0.org1.example.com", peerUrl, getTlsProperties());
//         channel.addPeer(peer);

//         channel.initialize();
//     }

//     private User getUserContext() throws Exception {
//         File certFile = new File(cryptoPath + "/signcerts/cert.pem");
//         File keyFolder = new File(cryptoPath + "/keystore");
//         File[] keyFiles = keyFolder.listFiles((dir, name) -> name.endsWith("_sk"));
//         if (keyFiles == null || keyFiles.length == 0) {
//             throw new RuntimeException("No private key found in keystore");
//         }

//         String cert = new String(Files.readAllBytes(certFile.toPath()));
//         String keyPem = new String(Files.readAllBytes(keyFiles[0].toPath()));
    
//         PrivateKey privateKey = getPrivateKeyFromString(keyPem);
//         return new FileSystemUser("Admin", mspId, cert, privateKey);
//     }

//     private PrivateKey getPrivateKeyFromString(String pemKey) throws Exception {
//         Security.addProvider(new BouncyCastleProvider());
//         PEMParser pemParser = new PEMParser(new StringReader(pemKey));
//         Object obj = pemParser.readObject();
//         pemParser.close();
    
//         JcaPEMKeyConverter converter = new JcaPEMKeyConverter().setProvider("BC");
    
//         if (obj instanceof org.bouncycastle.openssl.PEMKeyPair) {
//             return converter.getKeyPair((org.bouncycastle.openssl.PEMKeyPair) obj).getPrivate();
//         } else if (obj instanceof PrivateKeyInfo) {
//             return converter.getPrivateKey((PrivateKeyInfo) obj);
//         } else if (obj instanceof ASN1Sequence) {
//             RSAPrivateKey rsa = RSAPrivateKey.getInstance(obj);
//             PrivateKeyInfo keyInfo = new PrivateKeyInfo(
//                 new org.bouncycastle.asn1.x509.AlgorithmIdentifier(
//                     org.bouncycastle.asn1.pkcs.PKCSObjectIdentifiers.rsaEncryption),
//                 rsa);
//             return converter.getPrivateKey(keyInfo);
//         } else {
//             throw new IllegalArgumentException("Unsupported key format: " + obj.getClass());
//         }
//     }
    

//     private Properties getTlsProperties() {
//         Properties props = new Properties();
//         props.put("pemFile", tlsCertPath);
//         props.put("sslProvider", "openSSL");
//         props.put("negotiationType", "TLS");
//         return props;
//     }

//     public String registerHealthRecord(HealthRecordHashed record) {
//         try {
//             TransactionProposalRequest request = hfClient.newTransactionProposalRequest();
//             request.setChaincodeName(chaincodeName);
//             request.setFcn("registerHealthRecord");
//             request.setArgs(
//                     record.getRecordId(),
//                     record.getPatientId(),
//                     record.getDoctorId(),
//                     record.getIpfsHash()
                    
//             );

//             Collection<ProposalResponse> responses = channel.sendTransactionProposal(request);

//             for (ProposalResponse response : responses) {
//                 if (response.getStatus() != ProposalResponse.Status.SUCCESS) {
//                     throw new RuntimeException("❌ Proposal failed: " + response.getMessage());
//                 }
//             }

//             channel.sendTransaction(responses).get();
//             return "✅ Health record registered with IPFS hash: " + record.getIpfsHash();
//         } catch (Exception e) {
//             throw new RuntimeException("❌ Error registering health record: " + e.getMessage(), e);
//         }
//     }

//     public String queryHealthRecord(String recordId) {
//         try {
//             QueryByChaincodeRequest queryRequest = hfClient.newQueryProposalRequest();
//             queryRequest.setChaincodeName(chaincodeName);
//             queryRequest.setFcn("queryHealthRecord");
//             queryRequest.setArgs(recordId);

//             Collection<ProposalResponse> responses = channel.queryByChaincode(queryRequest);

//             for (ProposalResponse response : responses) {
//                 if (response.getStatus() == ProposalResponse.Status.SUCCESS) {
//                     return response.getProposalResponse().getResponse().getPayload().toStringUtf8();
//                 }
//             }

//             return "⚠️ No record found for Record ID: " + recordId;
//         } catch (Exception e) {
//             throw new RuntimeException("❌ Error querying health record: " + e.getMessage(), e);
//         }
//     }

//     public String queryRecordsByPatient(String patientId) {
//         try {
//             QueryByChaincodeRequest queryRequest = hfClient.newQueryProposalRequest();
//             queryRequest.setChaincodeName(chaincodeName);
//             queryRequest.setFcn("queryRecordsByPatient");
//             queryRequest.setArgs(patientId);
    
//             Collection<ProposalResponse> responses = channel.queryByChaincode(queryRequest);
    
//             for (ProposalResponse response : responses) {
//                 if (response.getStatus() == ProposalResponse.Status.SUCCESS) {
//                     return response.getProposalResponse().getResponse().getPayload().toStringUtf8();
//                 }
//             }
    
//             return "⚠️ No records found for Patient ID: " + patientId;
//         } catch (Exception e) {
//             throw new RuntimeException("❌ Error querying patient records: " + e.getMessage(), e);
//         }
//     }

//     public String getRecordHistory(String recordId) {
//         try {
//             QueryByChaincodeRequest queryRequest = hfClient.newQueryProposalRequest();
//             queryRequest.setChaincodeName(chaincodeName);
//             queryRequest.setFcn("getRecordHistory");
//             queryRequest.setArgs(recordId);
    
//             Collection<ProposalResponse> responses = channel.queryByChaincode(queryRequest);
//             for (ProposalResponse response : responses) {
//                 if (response.getStatus() == ProposalResponse.Status.SUCCESS) {
//                     return response.getProposalResponse().getResponse().getPayload().toStringUtf8();
//                 }
//             }
//             return "⚠️ No history found for Record ID: " + recordId;
//         } catch (Exception e) {
//             throw new RuntimeException("❌ Error querying record history: " + e.getMessage(), e);
//         }
//     }
    
    
// }


package com.team07.blockchain_service.services.blockchain;

import com.team07.blockchain_service.dto.HealthRecordHashed;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;


import java.net.URI;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

@Service
public class BlockchainService {

    private final String scriptPath = "/home/damindu/Desktop/blockchain-platform/interact_chaincode.sh";

public String fetchRecordFromIPFS(String ipfsHash) {
    try {
        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://ipfs.io/ipfs/" + ipfsHash))
                .GET()
                .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() == 200) {
            return response.body();
        } else {
            throw new RuntimeException("❌ Failed to fetch from IPFS. HTTP status: " + response.statusCode());
        }
    } catch (Exception e) {
        throw new RuntimeException("❌ Failed to fetch from IPFS: " + e.getMessage(), e);
    }
}

    private String runShellCommand(String... args) {
        try {
            ProcessBuilder processBuilder = new ProcessBuilder(args);
            processBuilder.redirectErrorStream(true);
            Process process = processBuilder.start();

            StringBuilder output = new StringBuilder();
            try (BufferedReader reader = new BufferedReader(
                    new InputStreamReader(process.getInputStream()))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    output.append(line).append("\n");
                }
            }

            int exitCode = process.waitFor();
            if (exitCode != 0) {
                throw new RuntimeException("❌ Script failed with code " + exitCode + ": " + output);
            }

            return output.toString();
        } catch (Exception e) {
            throw new RuntimeException("❌ Error running shell script: " + e.getMessage(), e);
        }
    }

    public String registerHealthRecord(HealthRecordHashed record) {
        return runShellCommand("bash", scriptPath, "register", record.getRecordId(),
                record.getPatientId(), record.getDoctorId(), record.getIpfsHash());
    }

    public String queryHealthRecord(String recordId) {
        return runShellCommand("bash", scriptPath, "query", recordId);
    }

    public String queryHealthRecordAndFetch(String recordId) {
        String blockchainResponse = queryHealthRecord(recordId);
    
        // Extract IPFS hash from blockchain response
        Pattern pattern = Pattern.compile("\"ipfsHash\":\"(.*?)\"");
        Matcher matcher = pattern.matcher(blockchainResponse);
        if (matcher.find()) {
            String ipfsHash = matcher.group(1);
            return fetchRecordFromIPFS(ipfsHash);
        } else {
            throw new RuntimeException("❌ IPFS hash not found in blockchain response.");
        }
    }    

    public String updateHealthRecord(HealthRecordHashed record) {
        return runShellCommand("bash", scriptPath, "update", record.getRecordId(),
                record.getPatientId(), record.getDoctorId(), record.getIpfsHash());
    }

    public String deleteHealthRecord(String recordId) {
        return runShellCommand("bash", scriptPath, "delete", recordId);
    }

    public String getRecordHistory(String recordId) {
        return runShellCommand("bash", scriptPath, "history", recordId);
    }

    public String queryRecordsByPatient(String patientId) {
        return runShellCommand("bash", scriptPath, "by-patient", patientId);
    }
}
