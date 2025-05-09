// package com.team07.blockchain_service.config;

// import org.hyperledger.fabric.gateway.*;
// import org.springframework.beans.factory.annotation.Value;
// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;

// import java.io.BufferedReader;
// import java.nio.file.*;
// import java.security.PrivateKey;
// import java.security.cert.X509Certificate;

// @Configuration
// public class FabricConfig {

//     @Value("${hyperledger.fabric.network-config}")
//     private String networkConfigPath;

//     @Value("${hyperledger.fabric.channel}")
//     private String channelName;

//     @Value("${hyperledger.fabric.chaincode}")
//     private String chaincodeName;

//     @Value("${hyperledger.fabric.mspid}")
//     private String mspId;

//     @Value("${hyperledger.fabric.user}")
//     private String username;

//     @Value("${hyperledger.fabric.cert-path}")
//     private String certPath;

//     @Value("${hyperledger.fabric.key-dir}")
//     private String keyDir;

//     @Bean
//     public Gateway gateway() throws Exception {
//         // Load X.509 certificate
//         Path certFile = Paths.get(certPath);
//         BufferedReader certReader = Files.newBufferedReader(certFile);
//         X509Certificate certificate = Identities.readX509Certificate(certReader);

//         // Load private key
//         Path keyFolder = Paths.get(keyDir);
//         Path keyFile = Files.list(keyFolder)
//                 .filter(path -> path.toString().endsWith("_sk") || path.toString().endsWith(".pem"))
//                 .findFirst()
//                 .orElseThrow(() -> new RuntimeException("Private key not found in keystore"));
//         BufferedReader keyReader = Files.newBufferedReader(keyFile);
//         PrivateKey privateKey = Identities.readPrivateKey(keyReader);

//         // Create identity
//         Identity identity = Identities.newX509Identity(mspId, certificate, privateKey);

//         // Build gateway connection
//         Gateway.Builder builder = Gateway.createBuilder()
//                 .identity(identity)
//                 .networkConfig(Paths.get(networkConfigPath))
//                 .discovery(true);

//         return builder.connect();
//     }

//     @Bean
//     public Network network(Gateway gateway) {
//         return gateway.getNetwork(channelName);
//     }

//     @Bean
//     public Contract contract(Network network) {
//         return network.getContract(chaincodeName);
//     }
// }

// package com.team07.blockchain_service.config;

// import org.hyperledger.fabric.gateway.*;
// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;

// import java.io.BufferedReader;
// import java.nio.file.*;
// import java.security.PrivateKey;
// import java.security.cert.X509Certificate;

// @Configuration
// public class FabricConfig {

//     @Bean
//     public Gateway gateway() throws Exception {
//         // Hardcoded values
//         String networkConfigPath = "src/main/resources/fabric/connection-org1.yaml";
//         String mspId = "Org1MSP";
//         String certPath = "src/main/resources/fabric/wallet/Admin@org1.example.com-cert.pem";
//         String keyDir = "src/main/resources/fabric/keystore";
//         String username = "admin"; // Optional unless you're managing wallets

//         // Load certificate
//         Path certFile = Paths.get(certPath);
//         BufferedReader certReader = Files.newBufferedReader(certFile);
//         X509Certificate certificate = Identities.readX509Certificate(certReader);

//         // Load private key
//         Path keyFolder = Paths.get(keyDir);
//         Path keyFile = Files.list(keyFolder)
//                 .filter(path -> path.toString().endsWith("_sk") || path.toString().endsWith(".pem"))
//                 .findFirst()
//                 .orElseThrow(() -> new RuntimeException("Private key not found in keystore"));
//         BufferedReader keyReader = Files.newBufferedReader(keyFile);
//         PrivateKey privateKey = Identities.readPrivateKey(keyReader);

//         // Create identity
//         Identity identity = Identities.newX509Identity(mspId, certificate, privateKey);

//         // Build gateway
//         Gateway.Builder builder = Gateway.createBuilder()
//                 .identity(identity)
//                 .networkConfig(Paths.get(networkConfigPath))
//                 .discovery(true);

//         return builder.connect();
//     }

//     @Bean
//     public Network network(Gateway gateway) {
//         String channelName = "mychannel"; // Hardcoded channel name
//         return gateway.getNetwork(channelName);
//     }

//     @Bean
//     public Contract contract(Network network) {
//         String chaincodeName = "mycc"; // Hardcoded chaincode name
//         return network.getContract(chaincodeName);
//     }
// }


package com.team07.blockchain_service.config;

import org.hyperledger.fabric.gateway.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.BufferedReader;
import java.nio.file.*;
import java.security.PrivateKey;
import java.security.cert.X509Certificate;

@Configuration
public class FabricConfig {

    @Value("${hyperledger.fabric.network-config}")
    private String networkConfigPath;

    @Value("${hyperledger.fabric.channel}")
    private String channelName;

    @Value("${hyperledger.fabric.chaincode}")
    private String chaincodeName;

    @Value("${hyperledger.fabric.mspid}")
    private String mspId;

    @Value("${hyperledger.fabric.cert-path}")
    private String certPath;

    @Value("${hyperledger.fabric.key-dir}")
    private String keyDir;

    @Bean
    public Gateway gateway() throws Exception {
        // Load X.509 certificate
        Path certFile = Paths.get(certPath);
        BufferedReader certReader = Files.newBufferedReader(certFile);
        X509Certificate certificate = Identities.readX509Certificate(certReader);

        // Load private key
        Path keyFolder = Paths.get(keyDir);
        Path keyFile = Files.list(keyFolder)
                .filter(path -> path.toString().endsWith("_sk") || path.toString().endsWith(".pem"))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Private key not found in keystore"));
        BufferedReader keyReader = Files.newBufferedReader(keyFile);
        PrivateKey privateKey = Identities.readPrivateKey(keyReader);

        // Create identity
        Identity identity = Identities.newX509Identity(mspId, certificate, privateKey);

        // Build gateway connection
        Gateway.Builder builder = Gateway.createBuilder()
                .identity(identity)
                .networkConfig(Paths.get(networkConfigPath))
                .discovery(true);

        return builder.connect();
    }

    @Bean
    public Network network(Gateway gateway) {
        return gateway.getNetwork(channelName);
    }

    @Bean
    public Contract contract(Network network) {
        return network.getContract(chaincodeName);
    }
}
