package org.sid.school_managementback.controler;
import org.sid.school_managementback.DTO.MajorStudentCountDTO;
import org.sid.school_managementback.Repository.MajorRepository;
import org.sid.school_managementback.exception.ErrorResponse;
import org.sid.school_managementback.exception.ResourceNotFoundException;
import org.sid.school_managementback.mapper.MajorMapper;
import org.sid.school_managementback.serviceImpl.MajorServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.sid.school_managementback.DTO.MajorDto;
import org.sid.school_managementback.DTO.PostDto;
import org.sid.school_managementback.entity.Major;
import org.sid.school_managementback.service.MajorService;
import org.sid.school_managementback.service.PostService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/majors")
@CrossOrigin(origins = "http://localhost:4200")

public class MajorController extends GenericController<MajorDto, Long> {
    private final String uploadDir = "uploads/pdfs/";
    @Autowired
    private MajorMapper majorMapper;
    @Autowired
    private MajorRepository majorRepository;
    private final MajorService majorService;
    private final MajorServiceImpl majorServiceImpl;
    public MajorController(MajorService majorService, MajorServiceImpl majorServiceImpl) {
        super(majorService);
        this.majorService = majorService;
        this.majorServiceImpl = majorServiceImpl;
    }
    @PostMapping("/upload")
    public ResponseEntity<MajorDto> createMajorWithPdf(
            @RequestParam("name") String name,
            @RequestParam("contenu") String contenu,
            @RequestParam Long departementId,
            @RequestParam("chefId") Long chefId,
            @RequestParam(value = "file", required = false) MultipartFile file
    ) {
        return ResponseEntity.ok(majorServiceImpl.createMajor(name, contenu, file,departementId,chefId));
    }

    @GetMapping("/by-departement/{departementId}")
    public ResponseEntity<List<MajorDto>> getMajorsByDepartement(@PathVariable Long departementId) {
        return ResponseEntity.ok(majorServiceImpl.getMajorsByDepartementId(departementId));
    }
    @GetMapping("/student-count")
    public List<MajorStudentCountDTO> getStudentCountPerMajor(
            @RequestParam(required = false) String year) {
        return majorService.getStudentCountPerMajor(year);
    }
    @PostMapping("/{id}/pdf")
    public ResponseEntity<String> uploadPdf(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        try {
            Major major = majorRepository.findById(id).orElseThrow(() -> new RuntimeException("Major not found"));

            // Create folder if not exists
            File folder = new File(uploadDir);
            if (!folder.exists()) folder.mkdirs();

            // Save file
            String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
            String filePath = uploadDir + filename;
            file.transferTo(new File(filePath));

            // Save PDF info in major

            major.setPdfFilename(file.getOriginalFilename());
            major.setPdfPath(filePath);
            majorRepository.save(major);

            return ResponseEntity.ok("PDF uploaded successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Upload failed: " + e.getMessage());
        }
    }



    // Download PDF for a major

    @GetMapping("/download/{id}")
    public ResponseEntity<Resource> downloadMajorPdf(@PathVariable Long id) throws IOException {
        Major major = majorService.getEntityById(id); // <-- Entity, not DTO

        Path filePath = Paths.get(major.getPdfPath());
        Resource resource = new UrlResource(filePath.toUri());

        if (resource.exists() && resource.isReadable()) {
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + major.getPdfFilename() + "\"")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(resource);
        } else {
            throw new FileNotFoundException("File not found: " + major.getPdfPath());
        }
    }

    @PostMapping("/with-pdf")
    public ResponseEntity<String> uploadMajorWithPdf(
            @RequestPart("major") MajorDto majorDto,
            @RequestPart("pdf") MultipartFile file) {

        try {
            // Save the major entity first
            Major major = majorMapper.toEntity(majorDto);

            // Save file
            File folder = new File(uploadDir);
            if (!folder.exists()) folder.mkdirs();

            String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
            String filePath = uploadDir + filename;
            file.transferTo(new File(filePath));

            major.setPdfFilename(file.getOriginalFilename());
            major.setPdfPath(filePath);

            majorRepository.save(major);

            return ResponseEntity.ok("Major with PDF uploaded successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Upload failed: " + e.getMessage());
        }
    }


    @GetMapping("/professor/{professorId}")
    public ResponseEntity<?> getMajorsByProfessor(@PathVariable Long professorId) {
        try {
            List<MajorDto> majors = majorService.getMajorsByProfessor(professorId);
            return ResponseEntity.ok(majors);
        } catch (ResourceNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ResourceNotFoundException("Professor not found with id: " + professorId));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResourceNotFoundException("An error occurred while processing your request"));
        }
    }
}