package com.example.springbootmongodb.controller;

import com.example.springbootmongodb.repository.DetailsRepository;
import com.example.springbootmongodb.model.Details;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/details")
public class DetailsController {

    @Autowired
    private DetailsRepository detailsRepository;

    @Autowired
    private SessionManager sessionManager; // Dodano, aby użyć metody isSessionValid

    @PostMapping("/add")
    public ResponseEntity<Details> addDetails(@RequestHeader("Authorization") String sessionToken,
                                              @RequestBody Details details) {
        if (!sessionManager.isSessionValid(sessionToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        Details savedDetails = detailsRepository.save(details);
        return ResponseEntity.ok(savedDetails);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Details>> getAllDetails(@RequestHeader("Authorization") String sessionToken) {
        if (!sessionManager.isSessionValid(sessionToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        List<Details> detailsList = detailsRepository.findAll();
        return ResponseEntity.ok(detailsList);
    }

    @GetMapping("/byDeviceId")
    public ResponseEntity<List<Details>> getDetailsByDeviceId(@RequestHeader("Authorization") String sessionToken,
                                                              @RequestParam String deviceId) {
        if (!sessionManager.isSessionValid(sessionToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        List<Details> detailsList = detailsRepository.findByDeviceId(deviceId);
        return ResponseEntity.ok(detailsList);
    }
}

