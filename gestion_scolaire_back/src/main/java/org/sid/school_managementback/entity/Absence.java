package org.sid.school_managementback.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Absence extends BaseEntity{



    private String timeSlot;
    private LocalDate date;

    private String justification;

    @ManyToOne
    @JoinColumn(name = "etudiant_id")
    @JsonBackReference
    private Student etudiant;

    @ManyToOne
    @JoinColumn(name = "module_id")
    private Module module;
}
