package org.sid.school_managementback.mapper;

import org.mapstruct.*;
import org.sid.school_managementback.DTO.StudentDto;
import org.sid.school_managementback.entity.Module;
import org.sid.school_managementback.entity.Student;

import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;
@Mapper(componentModel = "spring", uses = {NoteMapper.class})
public interface StudentMapper extends GenericMapper<Student, StudentDto> {

    @Mapping(source = "major.id", target = "majorId")
    @Mapping(source = "major.NAME", target = "majorName") // Changed from NAME to nom
     // Changed from departementName to nom
    @Mapping(source = "notes", target = "notes")
    @Mapping(target = "moduleIds", expression = "java(mapModulesToIds(student.getModules()))")
    StudentDto toDto(Student student);

    @Mapping(source = "majorId", target = "major.id")

    @Mapping(target = "modules", ignore = true) // Will be handled in afterMapping
    @InheritInverseConfiguration(name = "toDto")
    Student toEntity(StudentDto dto);

    // Convert Set<Module> to List<Long> (for DTO)
    default List<Long> mapModulesToIds(Set<Module> modules) {
        if (modules == null) {
            return Collections.emptyList();
        }
        return modules.stream()
                .map(Module::getId)
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }

    // Convert List<Long> to Set<Module> (for Entity)
    @AfterMapping
    default void mapModulesToEntity(StudentDto dto, @MappingTarget Student student) {
        if (dto.getModuleIds() != null) {
            student.setModules(dto.getModuleIds().stream()
                    .map(id -> {
                        Module module = new Module();
                        module.setId(id);
                        return module;
                    })
                    .collect(Collectors.toSet()));
        }
    }
}
