package com.example.springbootmongodb.controller;

import com.example.springbootmongodb.repository.PersonRepository;
import com.example.springbootmongodb.model.Person;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/persons")
public class PersonController {

    @Autowired
    private PersonRepository personRepository;

    @Autowired
    private SessionManager sessionManager; // Dodano, aby użyć metody isSessionValid

    @GetMapping
    public ResponseEntity<List<Person>> getAllPersons(@RequestHeader("Authorization") String sessionToken) {
        if (!sessionManager.isSessionValid(sessionToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        List<Person> persons = personRepository.findAll();
        return ResponseEntity.ok(persons);
    }

    @GetMapping("/emails")
    public ResponseEntity<List<String>> getAllPersonsEmails(@RequestHeader("Authorization") String sessionToken) {
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
    public ResponseEntity<Object> createPerson(@RequestHeader("Authorization") String sessionToken,
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
    public ResponseEntity<Person> getPersonById(@RequestHeader("Authorization") String sessionToken,
                                                @PathVariable String id) {
        if (!sessionManager.isSessionValid(sessionToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        Person person = personRepository.findById(id).orElse(null);
        return person != null ? ResponseEntity.ok(person) : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<Person> getPersonByEmail(@RequestHeader("Authorization") String sessionToken,
                                                   @PathVariable String email) {
        if (!sessionManager.isSessionValid(sessionToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        Person person = personRepository.findByEmail(email);
        return person != null ? ResponseEntity.ok(person) : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Person> updatePerson(@RequestHeader("Authorization") String sessionToken,
                                               @PathVariable String id,
                                               @RequestBody Person personDetails) {
        if (!sessionManager.isSessionValid(sessionToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
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
    public ResponseEntity<Void> deletePerson(@RequestHeader("Authorization") String sessionToken,
                                             @PathVariable String id) {
        if (!sessionManager.isSessionValid(sessionToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        if (personRepository.existsById(id)) {
            personRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}

