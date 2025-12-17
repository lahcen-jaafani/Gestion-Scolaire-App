package org.sid.school_managementback.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.sid.school_managementback.DTO.DepartementDTO;
import org.sid.school_managementback.DTO.UserDto;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor

public class Major extends BaseEntity{


    private String NAME;
    @ManyToOne
    @JoinColumn(name = "departement_id")
    private Departement departement;


    @OneToMany(mappedBy = "major", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<Student> students;
    @OneToMany(mappedBy = "major")
    @JsonManagedReference
    private List<Module> modules;

    @ManyToOne
    @JoinColumn(name = "chef_id")
    private Professor chef;



    @Column(length = 5000)
    private String contenu;
    @Column(name = "pdf_filename")
    private String pdfFilename;

    @Column(name = "pdf_path")
    private String pdfPath;
    private LocalDateTime dateCreation;

    @ManyToOne
    @JoinColumn(name = "auteur_id")
    private Student auteur;
    @PrePersist
    public void onCreate() {
        this.dateCreation = LocalDateTime.now();
    }
}
