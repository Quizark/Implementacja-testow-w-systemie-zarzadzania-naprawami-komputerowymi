package com.example.springbootmongodb.controller;

import com.example.springbootmongodb.model.Person;
import com.example.springbootmongodb.model.User;
import com.example.springbootmongodb.repository.PersonRepository;
import com.example.springbootmongodb.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/persons")
@Tag(name = "Person Management", description = "Zarządzanie danymi osób w systemie")
public class PersonController {

    @Autowired
    private PersonRepository personRepository;

    @Autowired
    private SessionManager sessionManager;

    @Autowired
    private UserRepository userRepository;
    @GetMapping
    @Operation(summary = "Pobierz wszystkie osoby", description = "Zwraca listę wszystkich osób znajdujących się w bazie danych")
    public ResponseEntity<List<Person>> getAllPersons(
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
        List<Person> persons = personRepository.findAll();
        return ResponseEntity.ok(persons);
    }

    @GetMapping("/emails")
    @Operation(summary = "Pobierz wszystkie adresy e-mail", description = "Zwraca listę wszystkich adresów e-mail osób")
    public ResponseEntity<List<String>> getAllPersonsEmails(
            @Parameter(description = "Token sesji autoryzacyjnej", required = true)
            @RequestHeader("Authorization") String sessionToken) {
        if (!sessionManager.isSessionValid(sessionToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        List<String> emails = personRepository.findAll()
                .stream()
                .map(Person::getEmail)
                .collect(Collectors.toList());

        return ResponseEntity.ok(emails);
    }

    @PostMapping("/create")
    @Operation(summary = "Dodaj nową osobę", description = "Dodaje nową osobę do bazy danych")
    public ResponseEntity<Object> createPerson(
            @Parameter(description = "Token sesji autoryzacyjnej", required = true)
            @RequestHeader("Authorization") String sessionToken,
            @Parameter(description = "Dane nowej osoby", required = true)
            @RequestBody Person person) {
        if (!sessionManager.isSessionValid(sessionToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        if (personRepository.findByEmail(person.getEmail()) != null) {
            return new ResponseEntity<>("Email already in use", HttpStatus.CONFLICT);
        }

        Person savedPerson = personRepository.save(person);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Person registered successfully");
        response.put("person", savedPerson);

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Pobierz dane osoby po ID", description = "Zwraca dane osoby na podstawie podanego ID")
    public ResponseEntity<Person> getPersonById(
            @Parameter(description = "Token sesji autoryzacyjnej", required = true)
            @RequestHeader("Authorization") String sessionToken,
            @Parameter(description = "Identyfikator osoby", required = true)
            @PathVariable String id) {
        if (!sessionManager.isSessionValid(sessionToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        Person person = personRepository.findById(id).orElse(null);
        return person != null ? ResponseEntity.ok(person) : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @GetMapping("/email/{email}")
    @Operation(summary = "Pobierz dane osoby po e-mailu", description = "Zwraca dane osoby na podstawie adresu e-mail")
    public ResponseEntity<Person> getPersonByEmail(
            @Parameter(description = "Token sesji autoryzacyjnej", required = true)
            @RequestHeader("Authorization") String sessionToken,
            @Parameter(description = "Adres e-mail osoby", required = true)
            @PathVariable String email) {
        if (!sessionManager.isSessionValid(sessionToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        Person person = personRepository.findByEmail(email);
        return person != null ? ResponseEntity.ok(person) : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Zaktualizuj dane osoby", description = "Aktualizuje dane osoby na podstawie podanego ID")
    public ResponseEntity<Person> updatePerson(
            @Parameter(description = "Token sesji autoryzacyjnej", required = true)
            @RequestHeader("Authorization") String sessionToken,
            @Parameter(description = "Identyfikator osoby", required = true)
            @PathVariable String id,
            @Parameter(description = "Zaktualizowane dane osoby", required = true)
            @RequestBody Person personDetails) {
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
        return personRepository.findById(id)
                .map(person -> {
                    person.setName(personDetails.getName());
                    person.setSurname(personDetails.getSurname());
                    person.setEmail(personDetails.getEmail());
                    person.setPhone(personDetails.getPhone());
                    personRepository.save(person);
                    return ResponseEntity.ok(person);
                })
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Usuń osobę", description = "Usuwa osobę na podstawie podanego ID")
    public ResponseEntity<Void> deletePerson(
            @Parameter(description = "Token sesji autoryzacyjnej", required = true)
            @RequestHeader("Authorization") String sessionToken,
            @Parameter(description = "Identyfikator osoby", required = true)
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
        if (personRepository.existsById(id)) {
            personRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
