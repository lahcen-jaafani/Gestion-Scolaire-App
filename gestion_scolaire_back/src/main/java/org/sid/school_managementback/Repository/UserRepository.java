package org.sid.school_managementback.Repository;

import org.sid.school_managementback.entity.RoleName;
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
public interface UserRepository extends GenericRepository<User, Long> {
    List<User> findByRole(RoleName role);

    @Query("SELECT u FROM Student u WHERE u.anneeUniversitaire = :year AND u.major IS NOT NULL AND u.major.id = :majorId AND u.niveauScolaire = :niveau")
    List<Student> findStudentsByYearAndMajorAndNiveau(@Param("year") String year,
                                                      @Param("majorId") Long majorId,
                                                      @Param("niveau") String niveau);


    /**
     * Find a user by email.
     *
     * @param email the email to search for
     * @return an Optional containing the user if found, or empty if not found
     */
    Optional<User> findByEmail(String email);
    Optional<User> findByResetToken(String token);

    /**
     * Check if a user with the given email exists.
     *
     * @param email the email to check
     * @return true if a user with the email exists, false otherwise
     */
    boolean existsByEmail(String email);
}