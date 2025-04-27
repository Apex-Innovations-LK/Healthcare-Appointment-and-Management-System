package com.team07.ipfs_service.services.ipfs;

import io.ipfs.api.IPFS;
import io.ipfs.api.MerkleNode;
import io.ipfs.api.NamedStreamable;
import io.ipfs.multihash.Multihash;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.team07.ipfs_service.config.IpfsConfig;

import java.io.ByteArrayInputStream;
import java.io.InputStream;

@Service
public class IPFSService implements FileServiceImpl {

    @Autowired
    private IpfsConfig ipfsConfig;


    @Override
    public String saveFile(MultipartFile file) {
        try{

            InputStream stream = new ByteArrayInputStream(file.getBytes());
            NamedStreamable.InputStreamWrapper inputStreamWrapper = new NamedStreamable.InputStreamWrapper(stream);
            IPFS ipfs = ipfsConfig.getIpfs();

            MerkleNode merkleNode = ipfs.add(inputStreamWrapper).get(0);

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
}
