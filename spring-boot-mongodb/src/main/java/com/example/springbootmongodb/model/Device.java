package com.example.springbootmongodb.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "device")
public class Device {
    @Id
    private String id;
    private String codeNumber;
    private String description;
    private String deviceComplete;
    private String deviceWork;
    private String visibleDamage;
    private String email;
    private String date;
    private String employee;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public void setEmployee(String employee) {
        this.employee = employee;
    }

    public String getEmployee() {
        return employee;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getCodeNumber() {
        return codeNumber;
    }

    public void setCodeNumber(String codeNumber) {
        this.codeNumber = codeNumber;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getDeviceComplete() {
        return deviceComplete;
    }

    public void setDeviceComplete(String deviceComplete) {
        this.deviceComplete = deviceComplete;
    }

    public String getDeviceWork() {
        return deviceWork;
    }

    public void setDeviceWork(String deviceWork) {
        this.deviceWork = deviceWork;
    }

    public String getVisibleDamage() {
        return visibleDamage;
    }

    public void setVisibleDamage(String visibleDamage) {
        this.visibleDamage = visibleDamage;
    }

}