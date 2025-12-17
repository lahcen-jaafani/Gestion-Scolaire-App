package org.sid.school_managementback.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.sid.school_managementback.DTO.ModuleDto;
import org.sid.school_managementback.entity.Module;


@Mapper(componentModel = "spring")
public interface ModuleMapper extends GenericMapper<Module, ModuleDto> {
    @Mapping(source = "major.id", target = "majorId")
    @Mapping(source = "professeur.id", target = "professeurId")
    ModuleDto toDto(Module module);
    @Mapping(source = "majorId", target = "major.id")
    @Mapping(source = "professeurId", target = "professeur.id")
    Module toEntity(ModuleDto dto);
}

