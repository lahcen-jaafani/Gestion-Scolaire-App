package org.sid.school_managementback.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor

public class Departement extends BaseEntity{


    private String imageUrl;
    private String departementName;
    @OneToMany(mappedBy = "departement", cascade = CascadeType.ALL)
    private List<Major> majors;

    @ManyToOne
    @JoinColumn(name = "chef_id")
    private Professor chef;




}
