package com.team07.ipfs_service;

import com.team07.ipfs_service.config.IpfsConfig;
import com.team07.ipfs_service.dto.HealthRecord;
import com.team07.ipfs_service.dto.HealthRecordHashed;
import com.team07.ipfs_service.services.ipfs.IPFSService;
import com.team07.ipfs_service.services.producer.IPFSProducer;
import io.ipfs.api.IPFS;
import io.ipfs.api.MerkleNode;
import io.ipfs.api.NamedStreamable;
import io.ipfs.multihash.Multihash;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.io.IOException;
import java.lang.reflect.Field;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class IPFSServiceTest {

    @Mock
    private IpfsConfig ipfsConfig;

    @Mock
    private IPFSProducer ipfsProducer;

    @Mock
    private IPFS ipfs;

    @InjectMocks
    private IPFSService ipfsService;

    private HealthRecord testRecord;
    private String testHash;
    private List<String> multipleHashes;

    @BeforeEach
    void setUp() throws ParseException {
        // Create a more comprehensive test record
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

        // Sample IPFS hashes
        testHash = "QmU593515WPjpXGet1rx3bPH4hsiMHjFfP1PBhSFJVauKs";
        multipleHashes = Arrays.asList(
                "QmU593515WPjpXGet1rx3bPH4hsiMHjFfP1PBhSFJVauKs",
                "QmaC2GdFNfU65M8dx44uWvQQEntKBKN6ZJghnLw2cM39FA",
                "QmXBx3KywE8BtYsL5tV7friSk4AaZDoBH6mXJTmpehpqJh",
                "QmPRQY1DcyBCmohGj9GQY77iSSF2zYmA4Q9kshfzp3eWNd");

        // Configure IPFS mock
        when(ipfsConfig.getIpfs()).thenReturn(ipfs);
    }

    @Nested
    @DisplayName("Save File Tests")
    class SaveFileTests {

        @Test
        @DisplayName("Should save health record to IPFS and send to blockchain")
        void testSaveFile() throws IOException {
            // Setup
            MerkleNode mockNode = mock(MerkleNode.class);
            // Set the hash field using reflection since it's final
            Field hashField;
            try {
                hashField = MerkleNode.class.getDeclaredField("hash");
                hashField.setAccessible(true);
                hashField.set(mockNode, Multihash.fromBase58(testHash));
            } catch (NoSuchFieldException | IllegalAccessException e) {
                fail("Failed to set hash field on mocked MerkleNode: " + e.getMessage());
            }

            when(ipfs.add(any(NamedStreamable.class))).thenReturn(Arrays.asList(mockNode));

            // Execute
            String resultHash = ipfsService.saveFile(testRecord);

            // Verify
            assertEquals(testHash, resultHash);
            verify(ipfsConfig).getIpfs();
            verify(ipfs).add(any(NamedStreamable.class));

            // Verify producer was called with correct data
            ArgumentCaptor<HealthRecordHashed> hashedCaptor = ArgumentCaptor.forClass(HealthRecordHashed.class);
            verify(ipfsProducer).sendToBlockchain(hashedCaptor.capture());

            HealthRecordHashed captured = hashedCaptor.getValue();
            assertEquals(testRecord.getRecordId(), captured.getRecordId());
            assertEquals(testRecord.getPatientId(), captured.getPatientId());
            assertEquals(testRecord.getReferringDoctor(), captured.getDoctorId());
            assertEquals(testHash, captured.getIpfsHash());
        }

        @Test
        @DisplayName("Should handle IPFS errors when saving file")
        void testSaveFile_throwsException_whenIpfsErrors() throws IOException {
            // Setup
            when(ipfs.add(any(NamedStreamable.class))).thenThrow(new IOException("IPFS connection failed"));

            // Execute & Verify
            Exception exception = assertThrows(RuntimeException.class, () -> {
                ipfsService.saveFile(testRecord);
            });

            assertTrue(exception.getMessage().contains("Error whilst communicating with the IPFS node"));
            verify(ipfsConfig).getIpfs();
            verify(ipfs).add(any(NamedStreamable.class));

            // Verify producer was never called due to the exception
            verifyNoInteractions(ipfsProducer);
        }
    }

    @Nested
    @DisplayName("Load File Tests")
    class LoadFileTests {

        @Test
        @DisplayName("Should load file from IPFS by hash")
        void testLoadFile() throws IOException {
            // Setup
            byte[] expectedContent = "Medical record content for Peter Reynolds".getBytes();
            Multihash filePointer = Multihash.fromBase58(testHash);

            when(ipfs.cat(filePointer)).thenReturn(expectedContent);

            // Execute
            byte[] resultContent = ipfsService.loadFile(testHash);

            // Verify
            assertArrayEquals(expectedContent, resultContent);
            verify(ipfs).cat(filePointer);
        }

        @Test
        @DisplayName("Should throw RuntimeException when IPFS errors during load")
        void testLoadFile_throwsException_whenIpfsErrors() throws IOException {
            // Setup
            when(ipfs.cat(any(Multihash.class))).thenThrow(new IOException("IPFS error"));

            // Execute & Verify
            Exception exception = assertThrows(RuntimeException.class, () -> {
                ipfsService.loadFile(testHash);
            });

            assertTrue(exception.getMessage().contains("Error whilst communicating with the IPFS node"));
        }
    }

    @Nested
    @DisplayName("Load Multiple Files Tests")
    class LoadMultipleFilesTests {

        @Test
        @DisplayName("Should load multiple files from IPFS by hash")
        void testLoadMultipleFiles() throws IOException {
            // Setup - map each hash to unique content
            when(ipfs.cat(Multihash.fromBase58(multipleHashes.get(0)))).thenReturn("Content for hash 1".getBytes());
            when(ipfs.cat(Multihash.fromBase58(multipleHashes.get(1)))).thenReturn("Content for hash 2".getBytes());
            when(ipfs.cat(Multihash.fromBase58(multipleHashes.get(2)))).thenReturn("Content for hash 3".getBytes());
            when(ipfs.cat(Multihash.fromBase58(multipleHashes.get(3)))).thenReturn("Content for hash 4".getBytes());

            // Execute
            Map<String, byte[]> results = ipfsService.loadMultipleFiles(multipleHashes);

            // Verify
            assertEquals(4, results.size());
            assertTrue(results.containsKey(multipleHashes.get(0)));
            assertTrue(results.containsKey(multipleHashes.get(1)));
            assertTrue(results.containsKey(multipleHashes.get(2)));
            assertTrue(results.containsKey(multipleHashes.get(3)));

            assertArrayEquals("Content for hash 1".getBytes(), results.get(multipleHashes.get(0)));
            assertArrayEquals("Content for hash 2".getBytes(), results.get(multipleHashes.get(1)));
            assertArrayEquals("Content for hash 3".getBytes(), results.get(multipleHashes.get(2)));
            assertArrayEquals("Content for hash 4".getBytes(), results.get(multipleHashes.get(3)));

            // Verify each hash was requested from IPFS
            verify(ipfs).cat(Multihash.fromBase58(multipleHashes.get(0)));
            verify(ipfs).cat(Multihash.fromBase58(multipleHashes.get(1)));
            verify(ipfs).cat(Multihash.fromBase58(multipleHashes.get(2)));
            verify(ipfs).cat(Multihash.fromBase58(multipleHashes.get(3)));
        }

        @Test
        @DisplayName("Should handle partial failures when loading multiple files")
        void testLoadMultipleFiles_withPartialFailure() throws IOException {
            // Setup - first and third file load successfully, second and fourth fail
            when(ipfs.cat(Multihash.fromBase58(multipleHashes.get(0)))).thenReturn("Content for hash 1".getBytes());
            when(ipfs.cat(Multihash.fromBase58(multipleHashes.get(1))))
                    .thenThrow(new IOException("Failed to load file"));
            when(ipfs.cat(Multihash.fromBase58(multipleHashes.get(2)))).thenReturn("Content for hash 3".getBytes());
            when(ipfs.cat(Multihash.fromBase58(multipleHashes.get(3)))).thenThrow(new IOException("File not found"));

            // Execute
            Map<String, byte[]> results = ipfsService.loadMultipleFiles(multipleHashes);

            // Verify - only successful loads should be in the results
            assertEquals(2, results.size());
            assertTrue(results.containsKey(multipleHashes.get(0)));
            assertFalse(results.containsKey(multipleHashes.get(1)));
            assertTrue(results.containsKey(multipleHashes.get(2)));
            assertFalse(results.containsKey(multipleHashes.get(3)));

            assertArrayEquals("Content for hash 1".getBytes(), results.get(multipleHashes.get(0)));
            assertArrayEquals("Content for hash 3".getBytes(), results.get(multipleHashes.get(2)));
        }
    }
}