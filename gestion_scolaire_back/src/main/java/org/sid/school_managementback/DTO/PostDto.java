package org.sid.school_managementback.DTO;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.sid.school_managementback.entity.PostType;

import java.time.LocalDateTime;
/**
 * Data Transfer Object for Post entity.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PostDto extends BaseDto {


    private PostType type;

    @NotBlank(message = "Le titre est obligatoire")
    @Size(max = 255, message = "Le titre ne doit pas dépasser 255 caractères")
    private String titre;

    private String imageUrl;

    @NotBlank(message = "Le contenu est obligatoire")
    @Size(max = 5000, message = "Le contenu ne doit pas dépasser 5000 caractères")
    private String contenu;

    private LocalDateTime dateCreation;

    private StudentDto auteur ; // ou un UserDto simplifié si besoin
}
