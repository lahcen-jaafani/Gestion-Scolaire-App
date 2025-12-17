package org.sid.school_managementback.service;

import org.sid.school_managementback.DTO.UserDto;
import org.sid.school_managementback.entity.User;

import java.util.List;
import java.util.Optional;

/**
 * Service interface for User-related operations.
 */
public interface UserService extends GenericService<UserDto, Long> {

    List<UserDto> getStudentsByYearMajorAndNiveau(String year, Long majorId, String niveau);

    List<User> getProfessors();

    List<User> getAllProfessors();
    List<User> getAllStudents();
    List<UserDto> getStudentsByYearAndMajor(String year, Long majorId);


}