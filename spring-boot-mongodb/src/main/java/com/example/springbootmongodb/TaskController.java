package com.example.springbootmongodb;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tasks")
public class TaskController {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private SessionManager sessionManager; // Dodano, aby użyć metody isSessionValid

    @GetMapping
    public ResponseEntity<List<Task>> getAllTasks(@RequestHeader("Authorization") String sessionToken) {
        if (!sessionManager.isSessionValid(sessionToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
        return ResponseEntity.ok(taskRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<Task> createTask(@RequestHeader("Authorization") String sessionToken,
                                           @RequestBody Task task) {
        if (!sessionManager.isSessionValid(sessionToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
        task.setIsDone(false);
        Task savedTask = taskRepository.save(task);
        return ResponseEntity.ok(savedTask);
    }

    @GetMapping("/user/{email}/incomplete")
    public ResponseEntity<List<Task>> getIncompleteTasksByUser(@RequestHeader("Authorization") String sessionToken,
                                                               @PathVariable String email) {
        if (!sessionManager.isSessionValid(sessionToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
        List<Task> incompleteTasks = taskRepository.findByEmployeeEmailAndIsDone(email, false);
        return new ResponseEntity<>(incompleteTasks, HttpStatus.OK);
    }

    @PutMapping("/done/{id}")
    public ResponseEntity<Void> updateTaskStatus(@RequestHeader("Authorization") String sessionToken,
                                                 @PathVariable String id) {
        if (!sessionManager.isSessionValid(sessionToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return taskRepository.findById(id)
                .map(task -> {
                    task.setIsDone(true); // Ustawia isDone na true
                    taskRepository.save(task); // Zapisuje zmieniony obiekt w repozytorium
                    return new ResponseEntity<Void>(HttpStatus.OK); // HTTP 200 OK
                })
                .orElseGet(() -> new ResponseEntity<Void>(HttpStatus.NOT_FOUND)); // HTTP 404 Not Found, jeśli zadanie nie istnieje
    }

    @GetMapping("/{email}")
    public ResponseEntity<List<Task>> getNotifications(@RequestHeader("Authorization") String sessionToken,
                                                       @PathVariable String email) {
        if (!sessionManager.isSessionValid(sessionToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
        return ResponseEntity.ok(taskRepository.findByEmployeeEmail(email));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(@RequestHeader("Authorization") String sessionToken,
                                             @PathVariable String id) {
        if (!sessionManager.isSessionValid(sessionToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid session token");
        }
        if (taskRepository.existsById(id)) {
            taskRepository.deleteById(id);
            return new ResponseEntity<>("Task deleted successfully", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Task not found", HttpStatus.NOT_FOUND);
        }
    }
}
