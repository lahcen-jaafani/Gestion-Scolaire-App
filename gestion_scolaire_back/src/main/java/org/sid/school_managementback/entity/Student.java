package org.sid.school_managementback.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@DiscriminatorValue("STUDENT")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Student extends User {
    private String cne;
    private String anneeUniversitaire;
    private String niveauScolaire;

    @ManyToOne
    @JoinColumn(name = "major_id")
    @JsonIgnoreProperties({"students", "modules"}) // More control than @JsonIgnore
    private Major major;

    @OneToMany(mappedBy = "etudiant", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties({"etudiant"}) // Better than @JsonManagedReference
    private List<Note> notes;


    private String semester;

    @ManyToMany(fetch = FetchType.LAZY)
    @JsonIgnoreProperties({"students", "notes", "absences"})
    @JoinTable(
            name = "student_modules",
            joinColumns = @JoinColumn(name = "student_id"),
            inverseJoinColumns = @JoinColumn(name = "module_id")
    )
    private Set<Module> modules = new HashSet<>();

    @OneToMany(mappedBy = "etudiant", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties({"etudiant"})
    private List<Absence> absences;
}