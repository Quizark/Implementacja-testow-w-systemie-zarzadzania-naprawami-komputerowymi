package com.example.springbootmongodb;

import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.Query;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface DeviceRepository extends MongoRepository<Device, String> {
    List<Device> findByEmail(String email);  // Zwraca listę urządzeń dla danego emaila

    List<Device> findByCodeNumber(String codeNumber);

    @Aggregation(pipeline = {
            "{ $group: { _id: null, maxCodeNumber: { $max: { $toInt: '$codeNumber' } } } }"
    })
    Integer findMaxCodeNumber();

    List<Device> findCodeNumbersByEmail(String email);

    Device findByCodeNumberAndEmail(String codeNumber, String email);
}