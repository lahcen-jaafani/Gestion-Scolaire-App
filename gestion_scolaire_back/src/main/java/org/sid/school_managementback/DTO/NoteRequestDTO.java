package org.sid.school_managementback.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data

@NoArgsConstructor
@AllArgsConstructor
public class NoteRequestDTO {
    private Long studentId;
    private Long moduleId;
    private double cc1;
    private double cc2;

    // Getters & Setters
}