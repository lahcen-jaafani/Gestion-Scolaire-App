package org.sid.school_managementback.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "user_type")
@Data
@NoArgsConstructor
@AllArgsConstructor
public abstract class User  {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    protected String firstName;

    @Column(nullable = false, length = 50)
    protected String lastName;

    @Column(nullable = false, unique = true, length = 100)
    protected String email;

    @Column(name = "reset_token")
    private String resetToken;

    @Column(nullable = false)
    protected String password;

    @Column(length = 15)
    protected String phoneNumber;

    @Enumerated(EnumType.STRING)
    protected RoleName role;

    @ManyToOne
    @JsonBackReference
    private Departement departement;


}
