package org.sid.school_managementback.controler;

import jakarta.validation.Valid;
import org.sid.school_managementback.DTO.DepartementDTO;
import org.sid.school_managementback.DTO.MajorDto;
import org.sid.school_managementback.DTO.PostDto;
import org.sid.school_managementback.service.DepartementService;
import org.sid.school_managementback.service.MajorService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@RestController
@RequestMapping("/api/departments")
@CrossOrigin(origins = "*")
public class DepartementController extends GenericController<DepartementDTO, Long> {

    private final DepartementService depService;

    public DepartementController(DepartementService depService) {
        super(depService);
        this.depService = depService;
    }
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<DepartementDTO> createDepartement(
            @RequestPart("post") @Valid DepartementDTO dto,
            @RequestPart(value = "image", required = false) MultipartFile imageFile
    ) throws IOException {

        if (imageFile != null && !imageFile.isEmpty()) {
            String fileName = UUID.randomUUID() + "_" + imageFile.getOriginalFilename();
            Path uploadPath = Paths.get("uploads/posts");

            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            Path filePath = uploadPath.resolve(fileName);
            Files.copy(imageFile.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            dto.setImageUrl("/uploads/posts/" + fileName);
        }

        DepartementDTO saved = depService.save(dto);
        return ResponseEntity.ok(saved);
    }

}