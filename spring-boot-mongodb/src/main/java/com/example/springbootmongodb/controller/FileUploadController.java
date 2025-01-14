package com.example.springbootmongodb.controller;

import com.example.springbootmongodb.model.PhotoMetadata;
import com.mongodb.client.gridfs.model.GridFSFile;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.gridfs.GridFsResource;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.InputStreamResource;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.media.Schema;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/upload")
@Tag(name = "File Upload Management", description = "Zarządzanie przesyłaniem plików i ich pobieraniem")
public class FileUploadController {

    @Autowired
    private GridFsTemplate gridFsTemplate;

    @Autowired
    private MongoTemplate mongoTemplate;

    @Autowired
    private SessionManager sessionManager;

    @PostMapping
    @Operation(summary = "Prześlij plik", description = "Przesyła plik i zapisuje jego metadane w bazie danych")
    public ResponseEntity<?> uploadFile(
            @Parameter(description = "Token sesji autoryzacyjnej", required = true)
            @RequestHeader("Authorization") String sessionToken,
            @Parameter(description = "Plik do przesłania", required = true, schema = @Schema(type = "string", format = "binary"))
            @RequestParam("file") MultipartFile file,
            @Parameter(description = "Kod urządzenia, do którego przypisany jest plik", required = true)
            @RequestParam("deviceCode") String deviceCode) {

        if (!sessionManager.isSessionValid(sessionToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid session token");
        }

        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("Please provide a valid file.");
            }

            String fileId = gridFsTemplate.store(file.getInputStream(), file.getOriginalFilename(), file.getContentType()).toString();
            mongoTemplate.save(new PhotoMetadata(fileId, file.getOriginalFilename(), file.getContentType(), deviceCode));

            return ResponseEntity.ok("File uploaded successfully. File ID: " + fileId);
        } catch (IOException e) {
            return ResponseEntity.status(500).body("An error occurred while uploading the file: " + e.getMessage());
        }
    }

    @GetMapping("/photos")
    @Operation(summary = "Pobierz zdjęcia urządzenia", description = "Zwraca listę identyfikatorów plików dla podanego kodu urządzenia")
    public ResponseEntity<?> getPhotosByDeviceCode(
            @Parameter(description = "Token sesji autoryzacyjnej", required = true)
            @RequestHeader("Authorization") String sessionToken,
            @Parameter(description = "Kod urządzenia, dla którego mają zostać pobrane zdjęcia", required = true)
            @RequestParam String deviceCode) {

        if (!sessionManager.isSessionValid(sessionToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid session token");
        }

        try {
            Query query = new Query(Criteria.where("deviceCode").is(deviceCode));
            List<PhotoMetadata> metadataList = mongoTemplate.find(query, PhotoMetadata.class);

            List<String> fileIds = metadataList.stream()
                    .map(PhotoMetadata::getId)
                    .collect(Collectors.toList());

            if (fileIds.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            return ResponseEntity.ok(fileIds);

        } catch (Exception e) {
            return ResponseEntity.status(500).body("An error occurred while retrieving the photos: " + e.getMessage());
        }
    }

    @GetMapping("/files")
    @Operation(summary = "Pobierz plik", description = "Pobiera plik na podstawie jego identyfikatora")
    public ResponseEntity<?> getFile(
            @Parameter(description = "Token sesji autoryzacyjnej", required = true)
            @RequestHeader("Authorization") String sessionToken,
            @Parameter(description = "Identyfikator pliku", required = true)
            @RequestParam String id) {

        if (!sessionManager.isSessionValid(sessionToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid session token");
        }

        try {
            System.out.println("Received request to fetch file with ID: " + id);
            GridFSFile gridFSFile = gridFsTemplate.findOne(Query.query(Criteria.where("_id").is(new ObjectId(id))));
            System.out.println("GridFSFile: " + gridFSFile);

            if (gridFSFile == null) {
                System.out.println("File not found for ID: " + id);
                return ResponseEntity.notFound().build();
            }

            GridFsResource resource = gridFsTemplate.getResource(gridFSFile);
            System.out.println("ContentType: " + resource.getContentType());

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(resource.getContentType()))
                    .body(new InputStreamResource(resource.getInputStream()));

        } catch (IOException e) {
            System.out.println("IOException occurred while retrieving the file: " + e.getMessage());
            return ResponseEntity.status(500).body("An error occurred while retrieving the file: " + e.getMessage());
        } catch (Exception e) {
            System.out.println("Exception occurred while retrieving the file: " + e.getMessage());
            return ResponseEntity.status(500).body("An error occurred while retrieving the file: " + e.getMessage());
        }
    }
}
