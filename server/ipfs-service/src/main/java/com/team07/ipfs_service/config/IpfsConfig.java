package com.team07.ipfs_service.config;

import io.ipfs.api.IPFS;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.factory.config.ConfigurableBeanFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Lazy;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

@Component
@Scope(value = ConfigurableBeanFactory.SCOPE_SINGLETON)
public class IpfsConfig {
    
    private static final Logger logger = LoggerFactory.getLogger(IpfsConfig.class);
    
    @Value("${ipfs.node.host:127.0.0.1}")
    private String ipfsHost;
    
    @Value("${ipfs.node.port:5001}")
    private int ipfsPort;
    
    private IPFS ipfs;
    
    @Bean
    @Lazy
    public IPFS ipfs() {
        if (ipfs == null) {
            try {
                logger.info("Initializing IPFS connection to {}:{}", ipfsHost, ipfsPort);
                ipfs = new IPFS(ipfsHost, ipfsPort);
                logger.info("IPFS connection established successfully");
            } catch (Exception e) {
                logger.error("Failed to connect to IPFS daemon: {}", e.getMessage());
                throw new RuntimeException("Could not connect to IPFS daemon. Is it running?", e);
            }
        }
        return ipfs;
    }
    
    public IPFS getIpfs() {
        return ipfs();
    }
}