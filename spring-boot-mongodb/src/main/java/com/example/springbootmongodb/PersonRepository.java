package com.example.springbootmongodb;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface
PersonRepository extends MongoRepository<Person, String> {
    Person findByEmail(String email);
}