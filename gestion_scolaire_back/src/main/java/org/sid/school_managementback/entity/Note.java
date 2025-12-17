package org.sid.school_managementback.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIdentityInfo(
        generator = ObjectIdGenerators.PropertyGenerator.class,
        property = "id")
public class Note extends BaseEntity {
    @Enumerated(EnumType.STRING)
    private ExamType examType;

    @Enumerated(EnumType.STRING)
    private SessionType sessionType = SessionType.NORMAL;

    private Double cc1;
    private Double cc2;
    private Double moyenne;

    @ManyToOne
    @JoinColumn(name = "etudiant_id")
    @JsonBackReference("student-note") // Unique reference name
    private Student etudiant;

    @ManyToOne
    @JoinColumn(name = "professeur_id", nullable = false)
    @JsonBackReference("professor-note") // Unique reference name
    private Professor professeur;

    private String observation;

    @ManyToOne
    @JoinColumn(name = "module_id")
    @JsonBackReference("module-note") // Unique reference name
    private Module module;

    private Double nr;
}