package org.sid.school_managementback.DTO;

import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.sid.school_managementback.entity.*;
import org.sid.school_managementback.entity.Module;

import java.util.List;

/**
 * Data Transfer Object for User entity.
 */
@Data

@NoArgsConstructor
@AllArgsConstructor
public class NoteDto  {

    private Long id;
    private Long etudiantId;
    private Long moduleId;
    private Double cc1;
    private Double cc2;
    @Column(nullable = false)
    private Double moyenne;
    private String observation;
    private Double nr;
    @Enumerated(EnumType.STRING)
    private ExamType examtype;

    @Enumerated(EnumType.STRING)
    private SessionType sessionType;// Default to normal session

    private Long professeurId;

}
