package org.sid.school_managementback.Repository;


import org.sid.school_managementback.entity.Absence;
import org.sid.school_managementback.entity.Module;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AbsenceRepository extends JpaRepository<Absence, Long> {
    List<Absence> findByEtudiant_Email(String email);
    List<Absence> findByEtudiantId(Long etudiantId);
    List<Absence> findByModule_Professeur_Id(Long professeurId);


}
