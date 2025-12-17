package org.sid.school_managementback.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.sid.school_managementback.DTO.DepartementDTO;
import org.sid.school_managementback.DTO.PostDto;
import org.sid.school_managementback.entity.Departement;
import org.sid.school_managementback.entity.Post;

@Mapper(componentModel = "spring")
public interface DepartementMapper extends GenericMapper<Departement, DepartementDTO> {

    @Mapping(target = "chefId", source = "chef.id")  // mappe chef.id vers chefId dans DTO
    DepartementDTO toDto(Departement department);

    @Mapping(target = "chef.id", source = "chefId")  // inverse mapping si besoin
    Departement toEntity(DepartementDTO dto);
}
