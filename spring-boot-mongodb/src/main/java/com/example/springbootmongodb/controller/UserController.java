package com.example.springbootmongodb.controller;

import com.example.springbootmongodb.util.JwtUtil;
import com.example.springbootmongodb.repository.UserRepository;
import com.example.springbootmongodb.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.beans.factory.annotation.Value;


import java.util.*;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/users")
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
    public ResponseEntity<Object> registerUser(@RequestBody User user) {
        if (!isValidEmail(user.getEmail())) {
            return new ResponseEntity<>("Invalid email format", HttpStatus.BAD_REQUEST);
        }

        if (userRepository.findByEmail(user.getEmail()) != null) {
            return new ResponseEntity<>("Email already in use", HttpStatus.CONFLICT);
        }
        user.setIsAdmin(false);

        User savedUser = userRepository.save(user);
        return new ResponseEntity<>(new RegisterResponse("User registered successfully", savedUser), HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> loginUser(@RequestBody User user) {
        User existingUser = userRepository.findByEmail(user.getEmail());
        if (existingUser == null) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Collections.singletonMap("message", "User not found"));
        }

        String hashedPassword = DigestUtils.sha256Hex(user.getPassword());
        if (!existingUser.getPassword().equals(hashedPassword)) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Collections.singletonMap("message", "Invalid password"));
        }



        // Generowanie tokena sesji
        String jwtToken = jwtUtil.generateToken(existingUser.getEmail(), existingUser.getId());

        // Zwrócenie tokena sesji w odpowiedzi
        Map<String, String> response = new HashMap<>();
        response.put("sessionToken", jwtToken);
        response.put("message", "Login successful");

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@RequestHeader("Authorization") String sessionToken, @PathVariable String id) {
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
    public ResponseEntity<List<String>> getAdminEmails(@RequestHeader("Authorization") String sessionToken) {
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
    public ResponseEntity<Map<String, Object>> checkIfUserIsAdmin(@RequestHeader("Authorization") String sessionToken, @PathVariable String email) {
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
    public ResponseEntity<User> updateUser(@RequestHeader("Authorization") String sessionToken, @PathVariable String id, @RequestBody User updatedUser) {
        if (!sessionManager.isSessionValid(sessionToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        return userRepository.findById(id)
                .map(user -> {
                    user.setName(updatedUser.getName());
                    user.setSurname(updatedUser.getSurname());
                    user.setEmail(updatedUser.getEmail());
                    user.setSpecialization(updatedUser.getSpecialization());
                    user.setIsAdmin(updatedUser.getIsAdmin());
                    userRepository.save(user);
                    return new ResponseEntity<>(user, HttpStatus.OK);
                })
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(@RequestHeader("Authorization") String sessionToken, @PathVariable String id) {
        if (!sessionManager.isSessionValid(sessionToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return new ResponseEntity<>("User deleted successfully", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<User>> getAllUsers(@RequestHeader("Authorization") String sessionToken) {
        if (!sessionManager.isSessionValid(sessionToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        List<User> users = userRepository.findAll();
        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    // Metoda do weryfikacji sesji
    @GetMapping("/verify")
    public ResponseEntity<Map<String, String>> verifySession(@RequestHeader("Authorization") String sessionToken) {
        if (sessionManager.isSessionValid(sessionToken)) {
            return ResponseEntity.ok(Collections.singletonMap("message", "Session is valid"));
        } else {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Collections.singletonMap("message", "Invalid session token"));
        }
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

    private boolean isValidEmail(String email) {
        String emailRegex = "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,6}$";
        return email != null && email.matches(emailRegex);
    }

}

