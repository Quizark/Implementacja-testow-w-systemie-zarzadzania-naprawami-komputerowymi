package com.example.springbootmongodb.controller;

import com.example.springbootmongodb.model.Task;
import com.example.springbootmongodb.model.User;
import com.example.springbootmongodb.repository.TaskRepository;
import com.example.springbootmongodb.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;

@RestController
@RequestMapping("/tasks")
@Tag(name = "Task Management", description = "Zarządzanie zadaniami w systemie")
public class TaskController {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private SessionManager sessionManager;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    @Operation(summary = "Pobierz wszystkie zadania", description = "Zwraca listę wszystkich zadań w systemie")
    public ResponseEntity<List<Task>> getAllTasks(
            @Parameter(description = "Token sesji autoryzacyjnej", required = true)
            @RequestHeader("Authorization") String sessionToken) {

        // Sprawdzamy, czy token sesji jest ważny
        if (!sessionManager.isSessionValid(sessionToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        // Sprawdzamy, czy użytkownik jest administratorem
        String userEmail = sessionManager.getEmailFromToken(sessionToken);  // Zakładamy, że masz metodę pobierającą email użytkownika z tokena
        User user = userRepository.findByEmail(userEmail);  // Pobieramy użytkownika po emailu

        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);  // Użytkownik nie istnieje
        }

        // Sprawdzamy, czy użytkownik jest administratorem
        if (!user.getIsAdmin()) {  // Załóżmy, że masz metodę getIsAdmin() w User
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);  // Użytkownik nie jest administratorem
        }

        // Jeśli token jest prawidłowy i użytkownik jest administratorem, zwracamy zadania
        return ResponseEntity.ok(taskRepository.findAll());
    }

    @PostMapping
    @Operation(summary = "Utwórz nowe zadanie", description = "Dodaje nowe zadanie do systemu")
    public ResponseEntity<Task> createTask(
            @Parameter(description = "Token sesji autoryzacyjnej", required = true)
            @RequestHeader("Authorization") String sessionToken,
            @Parameter(description = "Dane nowego zadania", required = true)
            @RequestBody Task task) {
        if (!sessionManager.isSessionValid(sessionToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
        // Sprawdzamy, czy użytkownik jest administratorem
        String userEmail = sessionManager.getEmailFromToken(sessionToken);  // Zakładamy, że masz metodę pobierającą email użytkownika z tokena
        User user = userRepository.findByEmail(userEmail);  // Pobieramy użytkownika po emailu

        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);  // Użytkownik nie istnieje
        }

        // Sprawdzamy, czy użytkownik jest administratorem
        if (!user.getIsAdmin()) {  // Załóżmy, że masz metodę getIsAdmin() w User
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);  // Użytkownik nie jest administratorem
        }

        task.setIsDone(false);
        Task savedTask = taskRepository.save(task);
        return ResponseEntity.ok(savedTask);
    }

    @GetMapping("/user/{email}/incomplete")
    @Operation(summary = "Pobierz nieukończone zadania użytkownika", description = "Zwraca listę nieukończonych zadań dla określonego użytkownika")
    public ResponseEntity<List<Task>> getIncompleteTasksByUser(
            @Parameter(description = "Token sesji autoryzacyjnej", required = true)
            @RequestHeader("Authorization") String sessionToken,
            @Parameter(description = "Adres e-mail użytkownika", required = true)
            @PathVariable String email) {
        if (!sessionManager.isSessionValid(sessionToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
        List<Task> incompleteTasks = taskRepository.findByEmployeeEmailAndIsDone(email, false);
        return new ResponseEntity<>(incompleteTasks, HttpStatus.OK);
    }

    @PutMapping("/done/{id}")
    @Operation(summary = "Zaktualizuj status zadania na ukończone", description = "Ustawia status zadania na ukończone dla podanego ID")
    public ResponseEntity<Void> updateTaskStatus(
            @Parameter(description = "Token sesji autoryzacyjnej", required = true)
            @RequestHeader("Authorization") String sessionToken,
            @Parameter(description = "Identyfikator zadania", required = true)
            @PathVariable String id) {
        if (!sessionManager.isSessionValid(sessionToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return taskRepository.findById(id)
                .map(task -> {
                    task.setIsDone(true);
                    taskRepository.save(task);
                    return new ResponseEntity<Void>(HttpStatus.OK);
                })
                .orElseGet(() -> new ResponseEntity<Void>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/{email}")
    @Operation(summary = "Pobierz powiadomienia dla użytkownika", description = "Zwraca listę zadań przypisanych do użytkownika")
    public ResponseEntity<List<Task>> getNotifications(
            @Parameter(description = "Token sesji autoryzacyjnej", required = true)
            @RequestHeader("Authorization") String sessionToken,
            @Parameter(description = "Adres e-mail użytkownika", required = true)
            @PathVariable String email) {
        if (!sessionManager.isSessionValid(sessionToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
        return ResponseEntity.ok(taskRepository.findByEmployeeEmail(email));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Usuń zadanie", description = "Usuwa zadanie na podstawie podanego ID")
    public ResponseEntity<String> deleteUser(
            @Parameter(description = "Token sesji autoryzacyjnej", required = true)
            @RequestHeader("Authorization") String sessionToken,
            @Parameter(description = "Identyfikator zadania", required = true)
            @PathVariable String id) {
        if (!sessionManager.isSessionValid(sessionToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid session token");
        }
        // Sprawdzamy, czy użytkownik jest administratorem
        String userEmail = sessionManager.getEmailFromToken(sessionToken);  // Zakładamy, że masz metodę pobierającą email użytkownika z tokena
        User user = userRepository.findByEmail(userEmail);  // Pobieramy użytkownika po emailu

        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);  // Użytkownik nie istnieje
        }

        // Sprawdzamy, czy użytkownik jest administratorem
        if (!user.getIsAdmin()) {  // Załóżmy, że masz metodę getIsAdmin() w User
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);  // Użytkownik nie jest administratorem
        }

        if (taskRepository.existsById(id)) {
            taskRepository.deleteById(id);
            return new ResponseEntity<>("Task deleted successfully", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Task not found", HttpStatus.NOT_FOUND);
        }
    }
    @GetMapping("/create-delete-user-task")
    @Operation(summary = "Utwórz zadanie usunięcia użytkownika", description = "Tworzy zadanie usunięcia użytkownika o podanym e-mailu dla administratora admin1@sznk.com")
    public ResponseEntity<String> createDeleteUserTask(
            @Parameter(description = "Adres e-mail użytkownika do usunięcia", required = true)
            @RequestParam String userEmail) {

        // Sprawdzenie, czy użytkownik o podanym emailu istnieje
        User userToDelete = userRepository.findByEmail(userEmail);
        if (userToDelete == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User with email " + userEmail + " not found.");
        }

        // Tworzenie nowego zadania
        Task deleteTask = new Task();
        deleteTask.setTaskDescription("Usuń użytkownika o mailu " + userEmail);
        deleteTask.setEmployeeEmail("admin1@sznk.com"); // Administrator przypisany do zadania
        deleteTask.setIsDone(false);

        taskRepository.save(deleteTask);

        return ResponseEntity.ok("Task to delete user " + userEmail + " created successfully.");
    }
}
