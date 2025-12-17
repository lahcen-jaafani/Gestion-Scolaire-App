package org.sid.school_managementback.Repository;

import org.sid.school_managementback.entity.Admin;
import org.sid.school_managementback.entity.RoleName;
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
public interface AdminRepository extends GenericRepository<Admin, Long> {
    List<User> findByRole(RoleName role);



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