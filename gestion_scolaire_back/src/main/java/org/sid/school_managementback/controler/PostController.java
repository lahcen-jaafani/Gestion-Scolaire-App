package org.sid.school_managementback.controler;

import jakarta.validation.Valid;
import org.sid.school_managementback.DTO.PostDto;
import org.sid.school_managementback.service.PostService;
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
@RequestMapping("/api/posts")
@CrossOrigin(origins = "*")
public class PostController extends GenericController<PostDto, Long> {

    private final PostService postService;

    public PostController(PostService postService) {
        super(postService);
        this.postService = postService;
    }
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<PostDto> createPost(
            @RequestPart("post") @Valid PostDto postDto,
            @RequestPart("image") MultipartFile imageFile
    ) throws IOException {
        // Sauvegarder l'image dans le dossier local
        String fileName = UUID.randomUUID() + "_" + imageFile.getOriginalFilename();
        Path uploadPath = Paths.get("uploads/posts");

        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        Path filePath = uploadPath.resolve(fileName);
        Files.copy(imageFile.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        // Sauvegarder l'URL dans le DTO
        postDto.setImageUrl("/uploads/posts/" + fileName);

        // Enregistrer le post
        PostDto savedPost = postService.save(postDto);
        return ResponseEntity.ok(savedPost);
    }
}