package org.sid.school_managementback.mapper;

import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.sid.school_managementback.DTO.MajorDto;
import org.sid.school_managementback.entity.Departement;
import org.sid.school_managementback.entity.Major;
import org.sid.school_managementback.entity.Professor;

@Mapper(componentModel = "spring")
public interface MajorMapper extends GenericMapper<Major, MajorDto> {
    @Mapping(source = "departement.id", target = "departementId")
    @Mapping(source = "chef.id", target = "chefId")
    // Update if you change the field
    MajorDto toDto(Major major);

    @Mapping(target = "departement", ignore = true)
    @Mapping(target = "chef", ignore = true)
   // Update if you change the field
    Major toEntity(MajorDto dto);

    @AfterMapping
    default void afterToEntity(@MappingTarget Major major, MajorDto dto) {
        if (dto.getDepartementId() != null) {
            Departement dept = new Departement();
            dept.setId(dto.getDepartementId());
            major.setDepartement(dept);
        }
        if (dto.getChefId() != null) {
            Professor chef = new Professor();
            chef.setId(dto.getChefId());
            major.setChef(chef);
        }
    }
}