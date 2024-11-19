package com.example.springbootmongodb;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document
public class PhotoMetadata {
    @Id
    private String id;
    private String filename;
    private String contentType;
    private String deviceCode;

    public PhotoMetadata() {
        // Default constructor is needed for deserialization
    }

    public PhotoMetadata(String id, String filename, String contentType, String deviceCode) {
        this.id = id;
        this.filename = filename;
        this.contentType = contentType;
        this.deviceCode = deviceCode;
    }

    // Getters and setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getFilename() {
        return filename;
    }

    public void setFilename(String filename) {
        this.filename = filename;
    }

    public String getContentType() {
        return contentType;
    }

    public void setContentType(String contentType) {
        this.contentType = contentType;
    }

    public String getDeviceCode() {
        return deviceCode;
    }

    public void setDeviceCode(String deviceCode) {
        this.deviceCode = deviceCode;
    }
}
