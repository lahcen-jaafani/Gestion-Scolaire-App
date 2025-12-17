package org.sid.school_managementback.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Post  extends BaseEntity{


    @Enumerated(EnumType.STRING)
    private PostType type;

    private String titre;

    @Column(length = 5000)
    private String contenu;


    private String imageUrl;

    private LocalDateTime dateCreation;


    @PrePersist
    public void onCreate() {
        this.dateCreation = LocalDateTime.now();
    }
}
