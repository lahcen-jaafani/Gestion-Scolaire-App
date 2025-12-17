package org.sid.school_managementback.DTO;

import jakarta.persistence.Column;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.sid.school_managementback.entity.*;

import java.util.List;

/**
 * Data Transfer Object for User entity.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ModuleDto extends BaseDto {
    private String nom;
    private Long majorId;
    private String majorName; // Added for better frontend display
    private String anneeUniversitaire;
    private Long professeurId;
    private String professeurName; // Added for better frontend display
    private String semester;
    private List<Long> studentIds; // For module-student relationships
}