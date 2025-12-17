package org.sid.school_managementback.Repository;

import org.sid.school_managementback.DTO.StudentDto;
import org.sid.school_managementback.entity.RoleName;
import org.sid.school_managementback.entity.SessionType;
import org.sid.school_managementback.entity.Student;
import org.sid.school_managementback.entity.User;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for User entity.
 */
@Repository
public interface StudentRepository extends GenericRepository<Student, Long> {
    List<User> findByRole(RoleName role);

    @Query("SELECT s FROM Student s WHERE s.anneeUniversitaire = :year " +
            "AND s.major.id = :majorId AND s.niveauScolaire = :niveau " +
            "AND s.role = 'STUDENT'")
    List<Student> findByYearAndMajorAndNiveau(@Param("year") String year,
                                              @Param("majorId") Long majorId,
                                              @Param("niveau") String niveau);

    @Query("SELECT DISTINCT s FROM Student s " +
            "WHERE s.major.id = :majorId " +
            "AND EXISTS (SELECT 1 FROM s.modules m WHERE m.semester = :semester)")
    List<Student> findByMajorAndModuleSemester(
            @Param("majorId") Long majorId,
            @Param("semester") String semester);

    @Query("SELECT s FROM Student s JOIN s.modules m WHERE m.id = :moduleId")
    List<Student> findByModuleId(@Param("moduleId") Long moduleId);

    List<Student> findByIdIn(List<Long> ids);

    /**
     * Find a user by email.
     *
     * @param email the email to search for
     * @return an Optional containing the user if found, or empty if not found
     */
    Optional<User> findByEmail(String email);

    /**
     * Check if a user with the given email exists.
     *
     * @param email the email to check
     * @return true if a user with the email exists, false otherwise
     */
    boolean existsByEmail(String email);

    @Query("SELECT s FROM Student s WHERE s.major.id = :majorId AND s.semester = :semester AND s.anneeUniversitaire = :anneeUniversitaire")
    List<Student> findByMajorIdAndSemesterAndAnneeUniversitaire(
            @Param("majorId") Long majorId,
            @Param("semester") String semester,
            @Param("anneeUniversitaire") String anneeUniversitaire
    );


    @Query("SELECT s FROM Student s " +
            "JOIN s.major m " +
            "LEFT JOIN FETCH s.notes n " +
            "WHERE m.id = :majorId " +
            "AND s.semester = :semester " +
            "AND s.anneeUniversitaire = :anneeUniversitaire " +
            "AND (:moduleId IS NULL OR EXISTS (SELECT 1 FROM s.notes note WHERE note.module.id = :moduleId)) " +
            "AND (:sessionType IS NULL OR EXISTS (SELECT 1 FROM s.notes note WHERE note.sessionType = :sessionType))")
    List<Student> findStudentsWithNotesByCriteria(
            @Param("majorId") Long majorId,
            @Param("semester") String semester,
            @Param("anneeUniversitaire") String anneeUniversitaire,
            @Param("moduleId") Long moduleId,
            @Param("sessionType") SessionType sessionType);

    @Query("SELECT DISTINCT s FROM Student s " +
            "JOIN FETCH s.major m " +
            "LEFT JOIN FETCH s.notes n " +
            "LEFT JOIN FETCH n.module mod " +  // Avoid N+1 queries for module
            "WHERE m.id = :majorId " +
            "AND s.semester = :semester " +
            "AND s.anneeUniversitaire = :anneeUniversitaire " +
            "AND (:moduleId IS NULL OR mod.id = :moduleId) " +
            "AND (:sessionType IS NULL OR n.sessionType = :sessionType) " +
            "AND (:etudiantId IS NULL OR s.id = :etudiantId)")
    List<Student> findStudentsWithNotesByCriteria2(
            @Param("majorId") Long majorId,
            @Param("semester") String semester,
            @Param("anneeUniversitaire") String anneeUniversitaire,
            @Param("moduleId") Long moduleId,
            @Param("sessionType") SessionType sessionType,
            @Param("etudiantId") Long etudiantId);
}