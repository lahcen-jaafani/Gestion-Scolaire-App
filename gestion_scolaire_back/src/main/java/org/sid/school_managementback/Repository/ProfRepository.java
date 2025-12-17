package org.sid.school_managementback.Repository;

import org.sid.school_managementback.entity.Professor;
import org.sid.school_managementback.entity.RoleName;
import org.sid.school_managementback.entity.User;
import org.sid.school_managementback.exception.EntityNotFoundException;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for User entity.
 */
@Repository
public interface ProfRepository extends GenericRepository<Professor, Long> {
    List<User> findByRole(RoleName role);

    default Professor findByIdOrThrow(Long id) {
        return findById(id).orElseThrow(() ->
                new EntityNotFoundException("Professor not found with id: " + id));
    }
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
}