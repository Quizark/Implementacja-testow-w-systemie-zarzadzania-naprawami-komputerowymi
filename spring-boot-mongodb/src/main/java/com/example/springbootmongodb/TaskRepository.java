package com.example.springbootmongodb;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface TaskRepository extends MongoRepository<Task, String> {
    List<Task> findByEmployeeEmail(String email);
    List<Task> findByEmployeeEmailAndIsDone(String employeeEmail, boolean isDone);
}
