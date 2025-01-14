package com.example.springbootmongodb.controller;

import com.example.springbootmongodb.model.User;
import com.example.springbootmongodb.repository.DetailsRepository;
import com.example.springbootmongodb.repository.DeviceRepository;
import com.example.springbootmongodb.repository.PersonRepository;
import com.example.springbootmongodb.model.Details;
import com.example.springbootmongodb.model.Device;
import com.example.springbootmongodb.repository.UserRepository;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.ServletOutputStream;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.itextpdf.text.Document;
import com.itextpdf.text.Paragraph;
import java.io.ByteArrayOutputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/devices")
@Tag(
        name = "Device Management",
        description = "Zarządzanie urządzeniami w systemie"
)
public class DeviceController {
    @Autowired
    private DetailsRepository detailsRepository;
    @Autowired
    private DeviceRepository deviceRepository;
    @Autowired
    private PersonRepository personRepository;
    @Autowired
    private SessionManager sessionManager; // Referencja do UserController, gdzie zarządzane są sesje
    @Autowired
    private UserRepository userRepository;
    private boolean isSessionValid(String sessionToken) {
        return sessionManager.isSessionValid(sessionToken);
    }

    @GetMapping
    @Operation(
            summary = "Pobierz wszystkie urządzenia",
            description = "Zwraca listę wszystkich urządzeń w systemie"
    )
    public ResponseEntity<List<Device>> getAllDevices(@Parameter(description = "Token sesji autoryzacyjnej",required = true) @RequestHeader("Authorization") String sessionToken) {
        if (!isSessionValid(sessionToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(null);
        }

        List<Device> devices = deviceRepository.findAll();
        return new ResponseEntity<>(devices, HttpStatus.OK);
    }

    @PostMapping("/create")
    @Operation(
            summary = "Utwórz nowe urządzenie",
            description = "Dodaje nowe urządzenie do systemu"
    )
    public ResponseEntity<Object> createDevice(@Parameter(description = "Token sesji autoryzacyjnej",required = true) @RequestHeader("Authorization") String sessionToken,
                                               @RequestBody Device device) {
        // Zapisz nowe urządzenie w bazie danych
        if (!isSessionValid(sessionToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(null);
        }

        if (deviceRepository.findByCodeNumber(device.getCodeNumber()) == null) {
            return new ResponseEntity<>("Code never in use. Generate new code or change current", HttpStatus.CONFLICT);
        }
        else if(personRepository.findByEmail(device.getEmail()) == null){
            return new ResponseEntity<>("Client with that E-mail not exist", HttpStatus.CONFLICT);
        }

        Device savedDevice = deviceRepository.save(device);

        // Przygotuj odpowiedź z komunikatem i zapisanym obiektem
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Device registered successfully");
        response.put("Device", savedDevice);

        // Zwróć odpowiedź z kodem statusu CREATED
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
    @PostMapping("/createNew")
    @Operation(
            summary = "Utwórz nowe urządzenie z automatycznym generowaniem kodu",
            description = "Dodaje nowe urządzenie do systemu, generując automatycznie unikalny kod urządzenia"
    )
    public ResponseEntity<Object> createNewDevice(@Parameter(description = "Token sesji autoryzacyjnej",required = true) @RequestHeader("Authorization") String sessionToken,
                                                  @RequestBody Device device) {
        if (!isSessionValid(sessionToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(null);
        }
        // Zapisz nowe urządzenie w bazie danych

        if(personRepository.findByEmail(device.getEmail()) == null){
            return new ResponseEntity<>("Client with that E-mail not exist", HttpStatus.CONFLICT);
        }
        // Pobierz maksymalny kod z bazy danych i wygeneruj nowy kod
        ResponseEntity<Integer> maxCodeNumber = getMaxCodeNumber(sessionToken);
        int newCodeNumber = maxCodeNumber.getBody().intValue() + 1;

        // Przypisz nowy kod do urządzenia
        device.setCodeNumber(String.valueOf(newCodeNumber));
        System.out.println(newCodeNumber);
        // Zapisz nowe urządzenie w bazie danych
        Device savedDevice = deviceRepository.save(device);

        // Przygotuj odpowiedź z komunikatem i zapisanym obiektem
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Device registered successfully");
        response.put("Device", savedDevice);

        // Zwróć odpowiedź z kodem statusu CREATED
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
    @GetMapping("/email/{email}")
    @Operation(
            summary = "Znajdź urządzenia po e-mailu",
            description = "Zwraca listę urządzeń przypisanych do danego adresu e-mail"
    )
    public ResponseEntity<List<Device>> findByEmail(@Parameter(description = "Token sesji autoryzacyjnej",required = true) @RequestHeader("Authorization") String sessionToken,
                                                    @PathVariable String email) {
        if (!isSessionValid(sessionToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(null);
        }
        List<Device> devices = deviceRepository.findByEmail(email);
        if (devices != null && !devices.isEmpty()) {
            return new ResponseEntity<>(devices, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    @GetMapping("/getDeviceIdByEmail/{email}")
    @Operation(
            summary = "Pobierz numery kodów urządzeń dla użytkownika",
            description = "Zwraca listę numerów kodów urządzeń przypisanych do danego użytkownika na podstawie e-maila"
    )
    public ResponseEntity<List<String>> findCodeNumbersByEmail(@Parameter(description = "Token sesji autoryzacyjnej",required = true) @RequestHeader("Authorization") String sessionToken,
                                                               @PathVariable String email) {
        if (!isSessionValid(sessionToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(null);
        }
        List<Device> devices = deviceRepository.findCodeNumbersByEmail(email);
        if (devices != null && !devices.isEmpty()) {
            // Mapowanie listy urządzeń do listy kodów
            List<String> codeNumbers = devices.stream()
                    .map(Device::getCodeNumber)
                    .collect(Collectors.toList());
            return new ResponseEntity<>(codeNumbers, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }


    @GetMapping("/{codeNumber}")
    @Operation(
            summary = "Znajdź urządzenia po numerze kodu",
            description = "Zwraca listę urządzeń na podstawie unikalnego numeru kodu"
    )
    public ResponseEntity<List<Device>> getDevicesByCodeNumber(@Parameter(description = "Token sesji autoryzacyjnej",required = true) @RequestHeader("Authorization") String sessionToken,
                                                               @PathVariable String codeNumber) {
        if (!isSessionValid(sessionToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(null);
        }

        List<Device> devices = deviceRepository.findByCodeNumber(codeNumber);
        return ResponseEntity.ok(devices);
    }

    @GetMapping("/maxCodeNumber")
    @Operation(
            summary = "Pobierz maksymalny numer kodu",
            description = "Zwraca maksymalny numer kodu urządzenia w systemie"
    )
    public ResponseEntity<Integer> getMaxCodeNumber(@Parameter(description = "Token sesji autoryzacyjnej",required = true) @RequestHeader("Authorization") String sessionToken) {
        if (!isSessionValid(sessionToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(null);
        }
        Integer maxCodeNumber = deviceRepository.findMaxCodeNumber();
        return ResponseEntity.ok(maxCodeNumber != null ? maxCodeNumber : 0);
    }

    @GetMapping("/generateCode")
    @Operation(
            summary = "Generuj nowy numer kodu urządzenia",
            description = "Zwraca nowy, unikalny numer kodu urządzenia na podstawie maksymalnego istniejącego numeru"
    )
    public ResponseEntity<Integer> generateCode(@Parameter(description = "Token sesji autoryzacyjnej",required = true) @RequestHeader("Authorization") String sessionToken) {
        if (!isSessionValid(sessionToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(null);
        }

        Integer maxCodeNumber = deviceRepository.findMaxCodeNumber();
        int newCodeNumber = (maxCodeNumber != null ? maxCodeNumber : 0) + 1;
        return ResponseEntity.ok(newCodeNumber);
    }

    @PutMapping("/{codeNumber}")
    @Operation(
            summary = "Zaktualizuj dane urządzenia",
            description = "Aktualizuje dane istniejącego urządzenia na podstawie numeru kodu"
    )
    public ResponseEntity<Device> updateDevice(@Parameter(description = "Token sesji autoryzacyjnej",required = true)  @RequestHeader("Authorization") String sessionToken,
                                               @PathVariable String codeNumber,
                                               @RequestBody Device deviceDetails) {
        if (!isSessionValid(sessionToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(null);
        }
        Device device = deviceRepository.findById(codeNumber).orElse(null);
        if (device != null) {
            device.setCodeNumber(deviceDetails.getCodeNumber());
            device.setEmail(deviceDetails.getEmail());
            device.setDescription(deviceDetails.getVisibleDamage());
            device.setVisibleDamage(deviceDetails.getVisibleDamage());
            device.setDeviceComplete(deviceDetails.getDeviceComplete());
            device.setDeviceWork(deviceDetails.getDeviceWork());

            Device updatedDevice = deviceRepository.save(device);
            return ResponseEntity.ok(updatedDevice);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
    }

    @DeleteMapping("/{codeNumber}")
    @Operation(
            summary = "Usuń urządzenie",
            description = "Usuwa urządzenie z systemu na podstawie numeru kodu"
    )
    public ResponseEntity<Void> deleteDevice(@Parameter(description = "Token sesji autoryzacyjnej",required = true) @RequestHeader("Authorization") String sessionToken,
                                             @PathVariable String codeNumber) {
        if (!isSessionValid(sessionToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .build();
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
        deviceRepository.deleteById(codeNumber);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/deviceWithDetails")
    @Operation(
            summary = "Pobierz dane o detalach urządzenia",
            description = "Pobiera dane o detalach urządzenia na podstawie adresu email i numeru urządzenia"
    )
    public ResponseEntity<Object> getDeviceWithDetails(@Parameter(description = "Token sesji autoryzacyjnej",required = false) @RequestHeader("Authorization") String sessionToken,
            @RequestParam String codeNumber,
            @RequestParam String email) {

        // Wyszukaj urządzenie na podstawie codeNumber i email
        Device device = deviceRepository.findByCodeNumberAndEmail(codeNumber, email);
        if (device == null) {
            return new ResponseEntity<>("Device not found", HttpStatus.NOT_FOUND);
        }

        // Wyszukaj szczegóły związane z tym urządzeniem
        List<Details> detailsList = detailsRepository.findByDeviceId(device.getId());

        // Stwórz odpowiedź zawierającą urządzenie oraz szczegóły
        Map<String, Object> response = new HashMap<>();
        response.put("device", device);
        response.put("details", detailsList);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }



    @GetMapping("/generatePdf")
    @Operation(
            summary = "Utwórz plik PDF",
            description = "Tworzy plik PDF z raportem o naprawie urządzenia na podstawie id urządzenia"
    )
    public void generatePdf(@Parameter(description = "Token sesji autoryzacyjnej",required = true) @RequestHeader("Authorization") String sessionToken,
                            @RequestParam String id, HttpServletResponse response) {
        // Wyszukaj urządzenie na podstawie id
        Device device = deviceRepository.findById(id).orElse(null);
        if (device == null) {
            response.setStatus(HttpStatus.NOT_FOUND.value());
            return;
        }

        // Wyszukaj szczegóły związane z tym urządzeniem
        List<Details> detailsList = detailsRepository.findByDeviceId(device.getId());

        // Ustawienia odpowiedzi dla pliku PDF
        response.setContentType("application/pdf");
        response.setHeader("Content-Disposition", "attachment; filename=device-details.pdf");

        try (ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
             ServletOutputStream outputStream = response.getOutputStream()) {

            // Utworzenie dokumentu PDF
            Document document = new Document();
            PdfWriter writer = PdfWriter.getInstance(document, byteArrayOutputStream);
            document.open();

            // Dodanie tytułu
            document.add(new Paragraph("Device Details"));

            // Informacje o urządzeniu
            document.add(new Paragraph("Code Number: " + device.getCodeNumber()));
            document.add(new Paragraph("Description: " + device.getDescription()));
            document.add(new Paragraph("Visible Damage: " + device.getVisibleDamage()));
            document.add(new Paragraph("Device Work: " + device.getDeviceWork()));
            document.add(new Paragraph("Device Complete: " + device.getDeviceComplete()));
            document.add(new Paragraph("Email: " + device.getEmail()));
            document.add(new Paragraph("Employee: " + device.getEmployee()));
            document.add(new Paragraph("Date: " + device.getDate()));
            if(!detailsList.isEmpty()) {
                // Szczegóły urządzenia
                document.add(new Paragraph("\nDetails:"));

                // Tabela z szczegółami
                PdfPTable table = new PdfPTable(3); // 3 kolumny: Data, Opis, Uwagi
                table.addCell("Date");
                table.addCell("Employee");
                table.addCell("Description");


                for (Details detail : detailsList) {
                    table.addCell(detail.getDate());
                    table.addCell(detail.getEmployee());
                    table.addCell(detail.getDescription());

                }

                // Dodanie tabeli do dokumentu
                document.add(table);
            }
            // Zamykanie dokumentu
            document.close();

            // Zapisz PDF do odpowiedzi
            outputStream.write(byteArrayOutputStream.toByteArray());
            outputStream.flush();

        } catch (Exception e) {
            response.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
        }
    }



}