package org.sid.school_managementback.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.util.List;

@Data

@NoArgsConstructor
@AllArgsConstructor
public class StudentWithNotesDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private String cne;
    private String semester;
    private String anneeUniversitaire;
    private String niveauScolaire;
    private Long majorId;
    private String majorName;
    private List<NoteDto> notes;

    // Constructors, getters, and setters
}