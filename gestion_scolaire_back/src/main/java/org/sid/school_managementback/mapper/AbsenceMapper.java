package org.sid.school_managementback.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.sid.school_managementback.DTO.AbsenceDto;
import org.sid.school_managementback.DTO.ModuleDto;
import org.sid.school_managementback.entity.Absence;
@Mapper(componentModel = "spring", uses = { StudentMapper.class })
public interface AbsenceMapper extends GenericMapper<Absence, AbsenceDto> {
    @Mapping(source = "etudiant.id", target = "etudiantId")
    @Mapping(source = "module.id", target = "moduleId")
    @Mapping(source = "timeSlot", target = "timeSlot")
    AbsenceDto toDto(Absence absence);

    @Mapping(source = "etudiantId", target = "etudiant.id")
    @Mapping(source = "moduleId", target = "module.id")
    Absence toEntity(AbsenceDto dto);
}
