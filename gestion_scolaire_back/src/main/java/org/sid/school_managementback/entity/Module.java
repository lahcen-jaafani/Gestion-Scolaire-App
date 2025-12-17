package org.sid.school_managementback.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Module extends BaseEntity {
    private String nom;

    @ManyToOne
    @JoinColumn(name = "major_id")
    @JsonIgnoreProperties({"modules", "students"}) // Prevent infinite recursion
    private Major major;

    @Column(nullable = false)
    private String semester;

    private String anneeUniversitaire;

    @ManyToOne
    @JoinColumn(name = "professeur_id")
    @JsonIgnoreProperties({"modules"}) // Instead of @JsonBackReference
    private Professor professeur;

    @OneToMany(mappedBy = "module", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties({"module"}) // Better than @JsonManagedReference
    private List<Note> notes;

    @OneToMany(mappedBy = "module", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties({"module"})
    private List<Absence> absences;

    @ManyToMany(mappedBy = "modules", fetch = FetchType.LAZY)
    @JsonIgnoreProperties({"modules", "notes", "absences"})
    private Set<Student> students = new HashSet<>();
}