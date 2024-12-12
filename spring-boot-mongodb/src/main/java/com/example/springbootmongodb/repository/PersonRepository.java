package com.example.springbootmongodb.repository;

import com.example.springbootmongodb.model.Person;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface
PersonRepository extends MongoRepository<Person, String> {
    Person findByEmail(String email);
}