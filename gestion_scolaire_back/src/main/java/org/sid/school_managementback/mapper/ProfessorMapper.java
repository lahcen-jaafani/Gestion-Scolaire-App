package org.sid.school_managementback.mapper;

import org.mapstruct.*;
import org.sid.school_managementback.DTO.ProfDto;

import org.sid.school_managementback.entity.Professor;

@Mapper(componentModel = "spring")
public interface ProfessorMapper extends GenericMapper<Professor, ProfDto> {

    ProfDto toDto(Professor professor);

    @InheritInverseConfiguration(name = "toDto")
    Professor toEntity(ProfDto dto);
}