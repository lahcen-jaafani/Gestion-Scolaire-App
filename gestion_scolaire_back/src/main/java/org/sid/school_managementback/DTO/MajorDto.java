package org.sid.school_managementback.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Data Transfer Object for Post entity.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MajorDto extends BaseDto {

    private String NAME;
    private DepartementDTO departement;
    private Long departementId;
    @NotNull
    private Long chefId;
    private String pdfFilename;
    private String pdfPath;
    private String contenu;
    private LocalDateTime dateCreation;
}