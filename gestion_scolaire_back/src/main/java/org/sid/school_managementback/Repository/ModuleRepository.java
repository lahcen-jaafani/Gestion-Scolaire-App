package org.sid.school_managementback.Repository;


import org.sid.school_managementback.entity.Module;
import org.sid.school_managementback.entity.Note;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ModuleRepository extends JpaRepository<Module, Long> {
    List<Module> findByProfesseurId(Long professeurId);
    List<Module> findByMajorId(Long majorId);
    @Query("SELECT m FROM Module m WHERE m.professeur.role = 'PROFESSOR'")
    List<Module> findModulesByProfesseurRoleProfessor();

    // Optional: if you want to filter by userId and ensure the role is professor
    @Query("SELECT m FROM Module m WHERE m.professeur.id = :profId AND m.professeur.role = 'PROFESSOR'")
    List<Module> findByProfesseurIdAndIsProfessor(@Param("profId") Long profId);

    List<Module> findByMajorIdAndProfesseurId(Long majorId, Long professeurId);

    List<Module> findByMajorIdAndSemesterAndAnneeUniversitaire(Long majorId, String semester, String anneeUniversitaire);

    @Query("SELECT m FROM Module m JOIN m.professeur p WHERE p.id = :professeurId AND m.major.id = :majorId")
    List<Module> findByProfesseurAndMajor(@Param("professeurId") Long professeurId,
                                          @Param("majorId") Long majorId);

    List<Module> findByMajorIdAndProfesseurIdAndSemesterAndAnneeUniversitaire(
            Long majorId,
            Long professeurId,
            String semester,
            String anneeUniversitaire);
}

