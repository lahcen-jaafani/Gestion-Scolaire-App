package org.sid.school_managementback.DTO;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.sid.school_managementback.entity.Module;

import org.sid.school_managementback.entity.User;

import java.time.LocalDate;

/**
 * Data Transfer Object for User entity.
 */
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class AbsenceDto extends BaseDto {

    private String timeSlot;
    private Long etudiantId;
    private Long moduleId;
    private LocalDate date;
    private String justification;
}
