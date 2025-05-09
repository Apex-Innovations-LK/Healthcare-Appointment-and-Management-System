package com.team07.ipfs_service.services.ipfs;

import io.ipfs.api.IPFS;
import io.ipfs.api.MerkleNode;
import io.ipfs.api.NamedStreamable;
import io.ipfs.multihash.Multihash;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.team07.ipfs_service.config.IpfsConfig;
import com.team07.ipfs_service.dto.HealthRecord;
import com.team07.ipfs_service.dto.HealthRecordHashed;
import com.team07.ipfs_service.services.producer.IPFSProducer;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class IPFSService implements FileServiceImpl {

    @Autowired
    private IpfsConfig ipfsConfig;
    
    @Autowired
    private IPFSProducer ipfsProducer; 

    @Override
    public String saveFile(HealthRecord record) {
        try{
            ObjectMapper objectMapper = new ObjectMapper();
            byte[] recordBytes = objectMapper.writeValueAsBytes(record);
            
            // Create an input stream from the record bytes
            InputStream stream = new ByteArrayInputStream(recordBytes);
            NamedStreamable.InputStreamWrapper inputStreamWrapper = 
                new NamedStreamable.InputStreamWrapper(record.getRecordId() + ".json", stream);
            
            // Get IPFS instance and add the file
            IPFS ipfs = ipfsConfig.getIpfs();
            MerkleNode merkleNode = ipfs.add(inputStreamWrapper).get(0);
            String ipfsHash = merkleNode.hash.toBase58();
            

            HealthRecordHashed healthRecordHashed = new HealthRecordHashed(
                record.getRecordId(),
                record.getPatientId(),
                record.getReferringDoctor(),
                ipfsHash
            );
            
            ipfsProducer.sendToBlockchain(healthRecordHashed);

            return merkleNode.hash.toBase58();
        } catch (Exception e){
            throw new RuntimeException("Error whilst communicating with the IPFS node.",e);
        }
    }

    @Override
    public byte[] loadFile(String hash) {
        try {

            IPFS ipfs = ipfsConfig.getIpfs();
            Multihash filePointer = Multihash.fromBase58(hash);
            return ipfs.cat(filePointer);


        } catch (Exception e){
            throw new RuntimeException("Error whilst communicating with the IPFS node.",e);
        }
    }

    @Override
    public Map<String, byte[]> loadMultipleFiles(List<String> hashes) {
    try {
        IPFS ipfs = ipfsConfig.getIpfs();
        Map<String, byte[]> results = new ConcurrentHashMap<>();
        
        // Use parallel processing for better performance
        hashes.parallelStream().forEach(hash -> {
            try {
                Multihash filePointer = Multihash.fromBase58(hash);
                byte[] content = ipfs.cat(filePointer);
                results.put(hash, content);
            } catch (Exception e) {
                // Log the error but continue with other files
                System.err.println("Failed to load file with hash: " + hash);
                e.printStackTrace();
            }
        
        });
        return results;
    } catch (Exception e) {
        throw new RuntimeException("Error whilst communicating with the IPFS node.", e);
    }
}


}