package org.sid.school_managementback.Repository;

import org.sid.school_managementback.entity.Departement;
import org.sid.school_managementback.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DepartementRepository extends JpaRepository<Departement, Long> {

}
