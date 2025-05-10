package com.team07.ipfs_service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.team07.ipfs_service.dto.HealthRecord;
import com.team07.ipfs_service.services.ipfs.IPFSService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

import io.ipfs.api.IPFS;
import io.ipfs.api.MerkleNode;
import io.ipfs.api.NamedStreamable;
import io.ipfs.multihash.Multihash;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.text.SimpleDateFormat;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(properties = {
        "spring.kafka.bootstrap-servers=localhost:9092",
        "ipfs.node.host=localhost"
})
public class IPFSServiceIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean  // Changed from @Mock to @MockBean
    private IPFSService ipfsService;  // Mock the service directly instead of IPFS

    @MockBean  // Changed from @Mock to @MockBean
    private KafkaTemplate<String, String> kafkaTemplate;

    @Test
    void testUploadEndpointIntegration() throws Exception {
        // Setup complete health record from provided JSON
        HealthRecord record = new HealthRecord();
        record.setRecordId("HR-006");
        record.setPatientId("PAT-80804");
        record.setPatientName("Peter Reynolds");

        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        record.setPatientDOB(dateFormat.parse("1952-04-05"));

        SimpleDateFormat timestampFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSZ");
        record.setDateOfService(timestampFormat.parse("2025-04-01T22:33:43.644+0000"));

        record.setReferringDoctor("DR-26773");
        record.setChiefComplaint(Arrays.asList("Fatigue", "Headache"));
        record.setAllergies(Arrays.asList("Dust", "Milk", "Eggs"));
        record.setMedications(Arrays.asList("Prednisone", "Atorvastatin", "Paracetamol"));
        record.setProblemList(Arrays.asList("Migraines", "Asthma", "Diabetes"));
        record.setPatientSex("Male");
        record.setAddress("1038 Perez Locks Suite 693");
        record.setCity("Colombo");
        record.setState("Western");
        record.setZip("00700");
        record.setPatientPhone("0784212097");
        record.setLbfData(Arrays.asList("LBF101:4.2", "LBF102:15.4", "LBF103:124/86"));
        record.setHisData(Arrays.asList("HIS007", "HIS007"));

        // Use the first provided IPFS hash
        String expectedHash = "QmU593515WPjpXGet1rx3bPH4hsiMHjFfP1PBhSFJVauKs";

        // Mock service method directly instead of mocking IPFS
        when(ipfsService.saveFile(any(HealthRecord.class))).thenReturn(expectedHash);

        // Execute and verify
        mockMvc.perform(post("/upload")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(record)))
                .andExpect(status().isOk())
                .andExpect(content().string(expectedHash));
    }

    @Test
    void testLoadMultipleFilesIntegration() throws Exception {
        // Use all the provided hashes
        List<String> hashes = Arrays.asList(
                "QmU593515WPjpXGet1rx3bPH4hsiMHjFfP1PBhSFJVauKs",
                "QmaC2GdFNfU65M8dx44uWvQQEntKBKN6ZJghnLw2cM39FA",
                "QmXBx3KywE8BtYsL5tV7friSk4AaZDoBH6mXJTmpehpqJh",
                "QmPRQY1DcyBCmohGj9GQY77iSSF2zYmA4Q9kshfzp3eWNd");

        // Create expected response map
        Map<String, byte[]> responseMap = new HashMap<>();
        for (String hash : hashes) {
            responseMap.put(hash, ("Content for hash " + hash).getBytes());
        }

        // Mock service method directly
        when(ipfsService.loadMultipleFiles(hashes)).thenReturn(responseMap);

        // Execute and verify batch retrieval
        mockMvc.perform(post("/files/batch")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(hashes)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.QmU593515WPjpXGet1rx3bPH4hsiMHjFfP1PBhSFJVauKs").exists())
                .andExpect(jsonPath("$.QmaC2GdFNfU65M8dx44uWvQQEntKBKN6ZJghnLw2cM39FA").exists())
                .andExpect(jsonPath("$.QmXBx3KywE8BtYsL5tV7friSk4AaZDoBH6mXJTmpehpqJh").exists())
                .andExpect(jsonPath("$.QmPRQY1DcyBCmohGj9GQY77iSSF2zYmA4Q9kshfzp3eWNd").exists());
    }

    @Test
    void testLoadSingleFileIntegration() throws Exception {
        // Setup 
        String hash = "QmU593515WPjpXGet1rx3bPH4hsiMHjFfP1PBhSFJVauKs";
        byte[] expectedContent = "Test file content for single file test".getBytes();
        
        // Mock service method directly
        when(ipfsService.loadFile(hash)).thenReturn(expectedContent);
        
        // Execute and verify
        mockMvc.perform(get("/file/{hash}", hash))
                .andExpect(status().isOk())
                .andExpect(content().bytes(expectedContent));
    }
}