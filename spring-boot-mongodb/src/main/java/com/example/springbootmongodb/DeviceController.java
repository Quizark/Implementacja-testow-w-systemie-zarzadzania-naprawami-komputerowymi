package com.example.springbootmongodb;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/devices")
public class DeviceController {
    @Autowired
    private DetailsRepository detailsRepository;
    @Autowired
    private DeviceRepository deviceRepository;
    @Autowired
    private PersonRepository personRepository;
    @Autowired
    private SessionManager sessionManager; // Referencja do UserController, gdzie zarządzane są sesje

    private boolean isSessionValid(String sessionToken) {
        return sessionManager.isSessionValid(sessionToken);
    }

    @GetMapping
    public ResponseEntity<List<Device>> getAllDevices(@RequestHeader("Authorization") String sessionToken) {
        if (!isSessionValid(sessionToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(null);
        }

        List<Device> devices = deviceRepository.findAll();
        return new ResponseEntity<>(devices, HttpStatus.OK);
    }

    @PostMapping("/create")
    public ResponseEntity<Object> createDevice(@RequestHeader("Authorization") String sessionToken,
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
    @GetMapping("/email/{email}")
    public ResponseEntity<List<Device>> findByEmail(@RequestHeader("Authorization") String sessionToken,
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
    public ResponseEntity<List<String>> findCodeNumbersByEmail(@RequestHeader("Authorization") String sessionToken,
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
    @PostMapping("/createNew")
    public ResponseEntity<Object> createNewDevice(@RequestHeader("Authorization") String sessionToken,
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

    @GetMapping("/{codeNumber}")
    public ResponseEntity<List<Device>> getDevicesByCodeNumber(@RequestHeader("Authorization") String sessionToken,
                                                               @PathVariable String codeNumber) {
        if (!isSessionValid(sessionToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(null);
        }

        List<Device> devices = deviceRepository.findByCodeNumber(codeNumber);
        return ResponseEntity.ok(devices);
    }

    @GetMapping("/maxCodeNumber")
    public ResponseEntity<Integer> getMaxCodeNumber(@RequestHeader("Authorization") String sessionToken) {
        if (!isSessionValid(sessionToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(null);
        }
        Integer maxCodeNumber = deviceRepository.findMaxCodeNumber();
        return ResponseEntity.ok(maxCodeNumber != null ? maxCodeNumber : 0);
    }

    @GetMapping("/generateCode")
    public ResponseEntity<Integer> generateCode(@RequestHeader("Authorization") String sessionToken) {
        if (!isSessionValid(sessionToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(null);
        }

        Integer maxCodeNumber = deviceRepository.findMaxCodeNumber();
        int newCodeNumber = (maxCodeNumber != null ? maxCodeNumber : 0) + 1;
        return ResponseEntity.ok(newCodeNumber);
    }

    @PutMapping("/{codeNumber}")
    public ResponseEntity<Device> updateDevice(@RequestHeader("Authorization") String sessionToken,
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
    public ResponseEntity<Void> deleteDevice(@RequestHeader("Authorization") String sessionToken,
                                             @PathVariable String codeNumber) {
        if (!isSessionValid(sessionToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .build();
        }

        deviceRepository.deleteById(codeNumber);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/deviceWithDetails")
    public ResponseEntity<Object> getDeviceWithDetails(
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
}