package org.sid.school_managementback.DTO;

import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.sid.school_managementback.entity.RoleName;

import java.util.List;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class UserDto extends BaseDto {

    @NotBlank(message = "First name is required")
    @Size(max = 50, message = "First name cannot exceed 50 characters")
    private String firstName;

    @NotBlank(message = "Last name is required")
    @Size(max = 50, message = "Last name cannot exceed 50 characters")
    private String lastName;

    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    @Size(max = 100, message = "Email cannot exceed 100 characters")
    private String email;

    @Column(name = "niveau_scolaire")
    private String niveauScolaire;

    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters long")
    private String password;

    @Pattern(regexp = "^$|^\\+?[0-9]{10,15}$", message = "Phone number should be valid")
    @Size(max = 15, message = "Phone number cannot exceed 15 characters")
    private String phoneNumber;

    @NotNull(message = "Role is required")
    @Enumerated(EnumType.STRING)
    private RoleName role;

    @Column(nullable = true)
    private String cne;
    @Column(name = "annee_universitaire", nullable = true)
    private String anneeUniversitaire;

    /**
     * Only include IDs for relations to simplify serialization and avoid cycles.
     * These fields should be manually set via mapper logic if needed.
     */
    private Long departementId;
    private Long majorId;
    private List<Long> postIds;
    private List<Long> noteIds;
    private List<Long> absenceIds;
    private List<Long> moduleIds;
}
