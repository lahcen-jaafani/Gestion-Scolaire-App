package org.sid.school_managementback.Repository;


import org.sid.school_managementback.DTO.MajorStudentCountDTO;
import org.sid.school_managementback.entity.Major;
import org.sid.school_managementback.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.NoRepositoryBean;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MajorRepository extends JpaRepository<Major, Long> {
    List<Major> findByDepartementId(Long departementId);
    @Query("SELECT DISTINCT m FROM Major m " +
            "JOIN m.modules mod " +
            "JOIN mod.professeur p " +
            "WHERE p.id = :professorId")
    List<Major> findByProfessorId(@Param("professorId") Long professorId);
    @Query("SELECT new org.sid.school_managementback.DTO.MajorStudentCountDTO(m.id, m.NAME, COUNT(s.id)) " +
            "FROM Major m " +
            "LEFT JOIN m.students s " +
            "WHERE (:year IS NULL OR s.anneeUniversitaire = :year) " +
            "GROUP BY m.id, m.NAME")
    List<MajorStudentCountDTO> countStudentsByMajorAndYear(String year);
}
