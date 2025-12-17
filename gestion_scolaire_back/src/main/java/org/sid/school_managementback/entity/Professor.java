package org.sid.school_managementback.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;
@Entity
@Data
@DiscriminatorValue("PROFESSOR")
@NoArgsConstructor
@AllArgsConstructor
public class Professor extends User {
    @OneToMany(mappedBy = "professeur")
    @JsonManagedReference
    private List<Module> modulesEnseignes;
    @OneToMany(mappedBy = "chef", cascade = CascadeType.ALL)
    private List<Departement> depertments;
    @OneToMany(mappedBy = "chef", cascade = CascadeType.ALL)
    private List<Major> majorchef;



}

