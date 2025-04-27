package com.madhushankha.ipfs_service.services;

import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.mime.MultipartEntityBuilder;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.util.Base64;

@Service
public class IPFSUploader {

    @Value("${pinata.api.url}")
    private String pinataUrl;

    @Value("${pinata.api.key}")
    private String pinataApiKey;

    @Value("${pinata.secret.key}")
    private String pinataSecretApiKey;

    public String uploadToIPFS(String base64, String fileName) throws Exception {
        byte[] fileData = Base64.getDecoder().decode(base64);

        HttpPost post = new HttpPost(pinataUrl);
        post.setHeader("pinata_api_key", pinataApiKey);
        post.setHeader("pinata_secret_api_key", pinataSecretApiKey);

        MultipartEntityBuilder builder = MultipartEntityBuilder.create();
        builder.addBinaryBody("file", new ByteArrayInputStream(fileData), org.apache.http.entity.ContentType.DEFAULT_BINARY, fileName);
        post.setEntity(builder.build());

        try (CloseableHttpClient client = HttpClients.createDefault();
             CloseableHttpResponse response = client.execute(post)) {

            String body = EntityUtils.toString(response.getEntity());
            JSONObject json = new JSONObject(body);
            return json.getString("IpfsHash");
        }
    }
}
