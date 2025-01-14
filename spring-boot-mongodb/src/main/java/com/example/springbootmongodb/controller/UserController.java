package com.example.springbootmongodb.controller;

import com.example.springbootmongodb.model.User;
import com.example.springbootmongodb.repository.UserRepository;
import com.example.springbootmongodb.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.beans.factory.annotation.Value;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/users")
@Tag(name = "User Management", description = "Zarządzanie użytkownikami w systemie")
public class UserController {

    @Value("${jwt.secret}")
    private String secretKey;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SessionManager sessionManager;

    @PostMapping("/register")
    @Operation(summary = "Zarejestruj się w systemie", description = "Rejestruje konto użytkownika w systemie")
    public ResponseEntity<Object> registerUser(@RequestBody User user) {
        // Walidacja formatu adresu e-mail
        if (!isValidEmail(user.getEmail())) {
            return new ResponseEntity<>("Invalid email format", HttpStatus.BAD_REQUEST);
        }

        // Sprawdzenie, czy e-mail jest już używany
        if (userRepository.findByEmail(user.getEmail()) != null) {
            return new ResponseEntity<>("Email already in use", HttpStatus.CONFLICT);
        }

        // Sprawdzenie, czy istnieje jakikolwiek administrator
        boolean hasAdmin = userRepository.existsByIsAdminTrue();

        // Sprawdzenie, czy istnieje jakiekolwiek aktywne konto
        boolean hasActiveUser = userRepository.findAll().stream().anyMatch(User::getIsActive);

        // Ustawienie flagi isAdmin i isActive
        user.setIsAdmin(!hasAdmin);
        user.setIsActive(!hasActiveUser);

        // Zapis użytkownika do bazy danych
        User savedUser = userRepository.save(user);

        // Komunikat odpowiedzi
        String message = hasAdmin
                ? "User registered successfully"
                : "User registered as an administrator because no admin accounts existed";

        if (!hasActiveUser) {
            message += " and set as active because no active accounts existed";
        }

        return new ResponseEntity<>(new RegisterResponse(message, savedUser), HttpStatus.CREATED);
    }


    @PostMapping("/login")
    @Operation(summary = "Zaloguj się do systemu", description = "Loguje użytkownika do systemu")
    public ResponseEntity<Map<String, String>> loginUser(@RequestBody User user) {
        User existingUser = userRepository.findByEmail(user.getEmail());

        // Logowanie statusu odpowiedzi
        Map<String, String> responseMap = new HashMap<>();

        if (existingUser == null) {
            responseMap.put("error", "USER_NOT_FOUND");
            responseMap.put("message", "User not found");
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(responseMap);
        }

        if (!existingUser.getIsActive()) {
            responseMap.put("error", "ACCOUNT_INACTIVE");
            responseMap.put("message", "Account is inactive");
            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body(responseMap);
        }

        String hashedPassword = DigestUtils.sha256Hex(user.getPassword());
        if (!existingUser.getPassword().equals(hashedPassword)) {
            responseMap.put("error", "INVALID_PASSWORD");
            responseMap.put("message", "Invalid password");
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(responseMap);
        }

        String jwtToken = jwtUtil.generateToken(existingUser.getEmail(), existingUser.getId());
        responseMap.put("sessionToken", jwtToken);
        responseMap.put("message", "Login successful");

        return ResponseEntity.ok(responseMap);
    }



    @GetMapping("/{id}")
    @Operation(summary = "Pobierz użytkownika po ID", description = "Zwraca szczegóły użytkownika na podstawie ID")
    public ResponseEntity<User> getUserById(
            @Parameter(description = "Token sesji autoryzacyjnej", required = true)
            @RequestHeader("Authorization") String sessionToken,
            @Parameter(description = "Identyfikator użytkownika", required = true)
            @PathVariable String id) {
        if (!sessionManager.isSessionValid(sessionToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        User user = userRepository.findById(id).orElse(null);
        if (user == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @GetMapping("/isAdmin")
    @Operation(summary = "Pobierz listę administratorów", description = "Zwraca listę adresów e-mail użytkowników z uprawnieniami administratora")
    public ResponseEntity<List<String>> getAdminEmails(
            @Parameter(description = "Token sesji autoryzacyjnej", required = true)
            @RequestHeader("Authorization") String sessionToken) {
        if (!sessionManager.isSessionValid(sessionToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        List<String> adminEmails = userRepository.findByIsAdminTrue()
                .stream()
                .map(User::getEmail)
                .collect(Collectors.toList());
        return new ResponseEntity<>(adminEmails, HttpStatus.OK);
    }

    @GetMapping("/isAdmin/{email}")
    @Operation(summary = "Sprawdź uprawnienia administratora", description = "Sprawdza, czy dany użytkownik jest administratorem")
    public ResponseEntity<Map<String, Object>> checkIfUserIsAdmin(
            @Parameter(description = "Token sesji autoryzacyjnej", required = true)
            @RequestHeader("Authorization") String sessionToken,
            @Parameter(description = "Adres e-mail użytkownika", required = true)
            @PathVariable String email) {
        if (!sessionManager.isSessionValid(sessionToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        User user = userRepository.findByEmail(email);
        if (user == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        Map<String, Object> response = Collections.singletonMap("isAdmin", user.getIsAdmin());
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Zaktualizuj dane użytkownika", description = "Aktualizuje dane użytkownika na podstawie ID")
    public ResponseEntity<User> updateUser(
            @Parameter(description = "Token sesji autoryzacyjnej", required = true)
            @RequestHeader("Authorization") String sessionToken,
            @Parameter(description = "Identyfikator użytkownika", required = true)
            @PathVariable String id,
            @Parameter(description = "Zaktualizowane dane użytkownika", required = true)
            @RequestBody User updatedUser) {
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

        return userRepository.findById(id)
                .map(existingUser -> {
                    existingUser.setName(updatedUser.getName());
                    existingUser.setSurname(updatedUser.getSurname());
                    existingUser.setEmail(updatedUser.getEmail());
                    existingUser.setSpecialization(updatedUser.getSpecialization());
                    existingUser.setIsAdmin(updatedUser.getIsAdmin());
                    existingUser.setIsActive(updatedUser.getIsActive());
                    userRepository.save(existingUser);
                    return new ResponseEntity<>(existingUser, HttpStatus.OK);
                })
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Usuń użytkownika", description = "Usuwa użytkownika na podstawie ID")
    public ResponseEntity<String> deleteUser(
            @Parameter(description = "Token sesji autoryzacyjnej", required = true)
            @RequestHeader("Authorization") String sessionToken,
            @Parameter(description = "Identyfikator użytkownika", required = true)
            @PathVariable String id) {
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
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return new ResponseEntity<>("User deleted successfully", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/all")
    @Operation(summary = "Pobierz wszystkich użytkowników", description = "Zwraca listę wszystkich użytkowników")
    public ResponseEntity<List<User>> getAllUsers(
            @Parameter(description = "Token sesji autoryzacyjnej", required = true)
            @RequestHeader("Authorization") String sessionToken) {
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
        List<User> users = userRepository.findAll();
        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    @GetMapping("/verify")
    @Operation(summary = "Zweryfikuj token sesji", description = "Sprawdza, czy podany token sesji jest ważny")
    public ResponseEntity<Map<String, String>> verifySession(
            @Parameter(description = "Token sesji autoryzacyjnej", required = true)
            @RequestHeader("Authorization") String sessionToken) {
        if (sessionManager.isSessionValid(sessionToken)) {
            return ResponseEntity.ok(Collections.singletonMap("message", "Session is valid"));
        } else {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Collections.singletonMap("message", "Invalid session token"));
        }
    }

    private boolean isValidEmail(String email) {
        String emailRegex = "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,6}$";
        return email != null && email.matches(emailRegex);
    }

    private static class RegisterResponse {
        private String message;
        private User user;

        public RegisterResponse(String message, User user) {
            this.message = message;
            this.user = user;
        }

        public String getMessage() {
            return message;
        }

        public User getUser() {
            return user;
        }
    }
}
