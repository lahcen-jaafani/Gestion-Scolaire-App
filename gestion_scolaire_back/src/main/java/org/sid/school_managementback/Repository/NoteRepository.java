package org.sid.school_managementback.Repository;


import org.sid.school_managementback.entity.ExamType;
import org.sid.school_managementback.entity.Major;
import org.sid.school_managementback.entity.Note;
import org.sid.school_managementback.entity.SessionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface NoteRepository extends JpaRepository<Note, Long> {
    List<Note> findByModuleId(Long moduleId);
    @Query("SELECT DISTINCT n.etudiant.id FROM Note n WHERE n.module.id = :moduleId")
    List<Long> findEtudiantIdsByModuleId(@Param("moduleId") Long moduleId);
    @Query("SELECT n FROM Note n WHERE n.etudiant.id = :etudiantId AND n.module.id = :moduleId AND n.examType = :examType")
    Optional<Note> findByStudentAndModuleAndExamType(
            @Param("etudiantId") Long etudiantId,
            @Param("moduleId") Long moduleId,
            @Param("examType") ExamType examType);

    boolean existsByModuleIdAndSessionType(Long moduleId, SessionType sessionType);
    boolean existsByEtudiantIdAndModuleIdAndSessionType(Long etudiantId, Long moduleId, SessionType sessionType);
    List<Note> findByModuleIdAndSessionType(Long moduleId, SessionType sessionType);
    @Query("SELECT n FROM Note n " +
            "JOIN n.module m " +
            "WHERE n.professeur.id = :professorId " +
            "AND m.major.id = :majorId " +
            "AND m.semester = :semester " +
            "AND n.sessionType = :sessionType")
    List<Note> findByProfessorAndMajorAndSemesterAndSessionType(
            @Param("professorId") Long professorId,
            @Param("majorId") Long majorId,
            @Param("semester") String semester,
            @Param("sessionType") SessionType sessionType
    );
}


   // @Query("SELECT n FROM Note n WHERE n.professeur.id = :professeurId")
  //  List<Note> findByProfesseurId(@Param("professeurId") Long professeurId);


