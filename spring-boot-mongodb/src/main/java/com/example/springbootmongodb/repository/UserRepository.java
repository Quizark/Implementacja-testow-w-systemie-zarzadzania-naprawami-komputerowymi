package com.example.springbootmongodb.repository;

import com.example.springbootmongodb.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface UserRepository extends MongoRepository<User, String> {
    User findByEmail(String email);
    List<User> findByIsAdminTrue();
}
