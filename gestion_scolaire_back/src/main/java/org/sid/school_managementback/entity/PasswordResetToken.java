package org.sid.school_managementback.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;

import java.util.Date;

@Entity
public class PasswordResetToken {
    @Id
    @GeneratedValue
    private Long id;

    private String token;

    @OneToOne
    private User user;

    private Date expiryDate;
}
