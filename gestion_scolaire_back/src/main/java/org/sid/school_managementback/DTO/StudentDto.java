package org.sid.school_managementback.DTO;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.sid.school_managementback.entity.Module;
import org.sid.school_managementback.entity.RoleName;

import java.util.List;
import java.util.Set;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentDto {
    private Long id;
    private String semester;
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private String password;
    private RoleName role;
    private String cne;
    private String anneeUniversitaire;
    private String niveauScolaire;
    private Long majorId;
    private String majorName;
    private List<NoteDto> notes;
    private List<Long> moduleIds; // Changed from single moduleId to list
}