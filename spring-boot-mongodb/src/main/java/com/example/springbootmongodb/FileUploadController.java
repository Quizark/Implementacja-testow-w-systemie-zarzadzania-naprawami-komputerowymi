package com.example.springbootmongodb;

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
import org.springframework.core.io.Resource;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/upload")
public class FileUploadController {

    @Autowired
    private GridFsTemplate gridFsTemplate;

    @Autowired
    private MongoTemplate mongoTemplate;

    @Autowired
    private SessionManager sessionManager; // Dodano, aby użyć metody isSessionValid

    // Method to handle file upload
    @PostMapping
    public ResponseEntity<?> uploadFile(@RequestHeader("Authorization") String sessionToken,
                                        @RequestParam("file") MultipartFile file,
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

    // Method to retrieve files by deviceCode
    @GetMapping("/photos")
    @ResponseBody
    public ResponseEntity<?> getPhotosByDeviceCode(@RequestHeader("Authorization") String sessionToken,
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

    // Method to retrieve file by ID
    @GetMapping("/files")
    @ResponseBody
    public ResponseEntity<?> getFile(@RequestHeader("Authorization") String sessionToken,
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
