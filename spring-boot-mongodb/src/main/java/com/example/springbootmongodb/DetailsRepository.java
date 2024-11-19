package com.example.springbootmongodb;

import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.Query;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
public interface DetailsRepository extends MongoRepository<Details, String> {
    List<Details> findByDeviceId(String deviceId);
    // Możesz dodać niestandardowe metody, jeśli potrzebujesz
}
