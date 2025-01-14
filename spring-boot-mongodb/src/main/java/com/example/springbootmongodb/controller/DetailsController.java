package com.example.springbootmongodb.controller;

import com.example.springbootmongodb.model.Details;
import com.example.springbootmongodb.repository.DetailsRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
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
    private SessionManager sessionManager;

    @Operation(
            summary = "Dodaj nowe szczegóły urządzenia",
            description = "Dodaje nowe szczegóły urządzenia po zweryfikowaniu poprawności tokena sesji."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Szczegóły urządzenia zostały dodane.",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = Details.class))),
            @ApiResponse(responseCode = "401", description = "Nieautoryzowany dostęp")
    })
    @PostMapping("/add")
    public ResponseEntity<Details> addDetails(@RequestHeader("Authorization") String sessionToken,
                                              @RequestBody Details details) {
        if (!sessionManager.isSessionValid(sessionToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        Details savedDetails = detailsRepository.save(details);
        return ResponseEntity.ok(savedDetails);
    }

    @Operation(
            summary = "Pobierz wszystkie szczegóły urządzeń",
            description = "Zwraca listę wszystkich szczegółów urządzeń w systemie po weryfikacji tokena sesji."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Lista szczegółów urządzeń została pobrana.",
                    content = @Content(mediaType = "application/json")),
            @ApiResponse(responseCode = "401", description = "Nieautoryzowany dostęp")
    })
    @GetMapping("/all")
    public ResponseEntity<List<Details>> getAllDetails(@RequestHeader("Authorization") String sessionToken) {
        if (!sessionManager.isSessionValid(sessionToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        List<Details> detailsList = detailsRepository.findAll();
        return ResponseEntity.ok(detailsList);
    }

    @Operation(
            summary = "Pobierz szczegóły urządzenia według ID",
            description = "Zwraca szczegóły urządzenia na podstawie jego ID po weryfikacji tokena sesji."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Szczegóły urządzenia zostały pobrane.",
                    content = @Content(mediaType = "application/json")),
            @ApiResponse(responseCode = "401", description = "Nieautoryzowany dostęp")
    })
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
