package org.sid.school_managementback.mapper;

import org.mapstruct.Named;


import org.sid.school_managementback.DTO.UserDto;
import org.sid.school_managementback.entity.Admin;
import org.sid.school_managementback.entity.Professor;
import org.sid.school_managementback.entity.Student;
import org.sid.school_managementback.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.InheritInverseConfiguration;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface UserMapper  {


    @Mapping(target = "id", source = "id")
    @Mapping(target = "lastName", source = "lastName")
    @Mapping(target = "firstName", source = "firstName")
    @Mapping(target = "email", source = "email")
    @Mapping(target = "role", source = "role")
    UserDto toDto(User user);

    @Named("mapToUser")
    default User toEntity(UserDto dto) {
        if (dto == null) {
            return null;
        }
        // Exemple basique : à adapter selon le rôle
        switch (dto.getRole()) {
            case STUDENT:
                Student student = new Student();
                student.setLastName(dto.getLastName());
                student.setFirstName(dto.getFirstName());
                student.setEmail(dto.getEmail());
                student.setRole(dto.getRole());
                return student;
            case PROFESSOR:
                Professor prof = new Professor();
                prof.setLastName(dto.getLastName());
                prof.setFirstName(dto.getFirstName());
                prof.setEmail(dto.getEmail());
                prof.setRole(dto.getRole());
                return prof;
            case ADMINISTRATOR:
                Admin admin = new Admin();
                admin.setLastName(dto.getLastName());
                admin.setFirstName(dto.getFirstName());
                admin.setEmail(dto.getEmail());
                admin.setRole(dto.getRole());
                return admin;
            default:
                throw new IllegalArgumentException("Unknown role: " + dto.getRole());
        }
    }
}
