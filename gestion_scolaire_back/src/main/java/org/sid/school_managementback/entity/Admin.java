package org.sid.school_managementback.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@DiscriminatorValue("ADMINISTRATOR")
public class Admin extends User {
    // No specific fields yet

}