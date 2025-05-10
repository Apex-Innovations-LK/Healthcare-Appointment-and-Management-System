package com.team07.ipfs_service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.team07.ipfs_service.controllers.IPFSController;
import com.team07.ipfs_service.config.IpfsConfig;
import com.team07.ipfs_service.dto.HealthRecord;
import com.team07.ipfs_service.services.ipfs.IPFSService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.text.SimpleDateFormat;
import java.util.*;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(IPFSController.class)
public class IPFSControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private IPFSService ipfsService;

    @Autowired
    private ObjectMapper objectMapper;

    private HealthRecord testRecord;
    private String sampleHash;
    private List<String> multipleHashes;
    private byte[] sampleFileContent;

    @BeforeEach
    void setUp() throws Exception {
        // Setup sample health record using the provided JSON data
        testRecord = new HealthRecord();
        testRecord.setRecordId("HR-006");
        testRecord.setPatientId("PAT-80804");
        testRecord.setPatientName("Peter Reynolds");
        
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        testRecord.setPatientDOB(dateFormat.parse("1952-04-05"));
        
        SimpleDateFormat timestampFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSZ");
        testRecord.setDateOfService(timestampFormat.parse("2025-04-01T22:33:43.644+0000"));
        
        testRecord.setReferringDoctor("DR-26773");
        testRecord.setChiefComplaint(Arrays.asList("Fatigue", "Headache"));
        testRecord.setAllergies(Arrays.asList("Dust", "Milk", "Eggs"));
        testRecord.setMedications(Arrays.asList("Prednisone", "Atorvastatin", "Paracetamol"));
        testRecord.setProblemList(Arrays.asList("Migraines", "Asthma", "Diabetes"));
        testRecord.setPatientSex("Male");
        testRecord.setAddress("1038 Perez Locks Suite 693");
        testRecord.setCity("Colombo");
        testRecord.setState("Western");
        testRecord.setZip("00700");
        testRecord.setPatientPhone("0784212097");
        testRecord.setLbfData(Arrays.asList("LBF101:4.2", "LBF102:15.4", "LBF103:124/86"));
        testRecord.setHisData(Arrays.asList("HIS007", "HIS007"));

        // Setup sample hashes 
        sampleHash = "QmU593515WPjpXGet1rx3bPH4hsiMHjFfP1PBhSFJVauKs";
        multipleHashes = Arrays.asList(
            "QmU593515WPjpXGet1rx3bPH4hsiMHjFfP1PBhSFJVauKs",
            "QmaC2GdFNfU65M8dx44uWvQQEntKBKN6ZJghnLw2cM39FA",
            "QmXBx3KywE8BtYsL5tV7friSk4AaZDoBH6mXJTmpehpqJh",
            "QmPRQY1DcyBCmohGj9GQY77iSSF2zYmA4Q9kshfzp3eWNd"
        );
        
        // Sample file content
        sampleFileContent = "Medical record file content for Peter Reynolds".getBytes();
        
        // Reset mocks before each test
        reset(ipfsService);
    }

    @Test
    void testSaveFile() throws Exception {
        // Configure mock to return the first hash when saving the record
        when(ipfsService.saveFile(any(HealthRecord.class))).thenReturn(sampleHash);

        
        mockMvc.perform(post("/upload")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testRecord)))
                .andExpect(status().isOk())
                .andExpect(content().string(sampleHash));

        // Verify the service was called
        verify(ipfsService, times(1)).saveFile(any(HealthRecord.class));
    }

    @Test
    void testLoadFile() throws Exception {
        // Configure mock to return sample content for the hash
        when(ipfsService.loadFile(sampleHash)).thenReturn(sampleFileContent);

       
        mockMvc.perform(get("/file/{hash}", sampleHash))
                .andExpect(status().isOk())
                .andExpect(content().bytes(sampleFileContent));

        // Verify the service was called
        verify(ipfsService, times(1)).loadFile(sampleHash);
    }

    @Test
    void testLoadMultipleFiles() throws Exception {
        // Create map of hash to content for multiple files
        Map<String, byte[]> filesMap = new HashMap<>();
        for (String hash : multipleHashes) {
            filesMap.put(hash, ("Content for " + hash).getBytes());
        }

        when(ipfsService.loadMultipleFiles(multipleHashes)).thenReturn(filesMap);

        
        mockMvc.perform(post("/files/batch")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(multipleHashes)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.QmU593515WPjpXGet1rx3bPH4hsiMHjFfP1PBhSFJVauKs").exists())
                .andExpect(jsonPath("$.QmaC2GdFNfU65M8dx44uWvQQEntKBKN6ZJghnLw2cM39FA").exists())
                .andExpect(jsonPath("$.QmXBx3KywE8BtYsL5tV7friSk4AaZDoBH6mXJTmpehpqJh").exists())
                .andExpect(jsonPath("$.QmPRQY1DcyBCmohGj9GQY77iSSF2zYmA4Q9kshfzp3eWNd").exists());

        // Verify the service was called
        verify(ipfsService, times(1)).loadMultipleFiles(multipleHashes);
    }
}