package com.example.springbootmongodb.repository;

import com.example.springbootmongodb.model.Details;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
public interface DetailsRepository extends MongoRepository<Details, String> {
    List<Details> findByDeviceId(String deviceId);
    // Możesz dodać niestandardowe metody, jeśli potrzebujesz
}
