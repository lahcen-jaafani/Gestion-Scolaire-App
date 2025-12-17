package org.sid.school_managementback.service;

import org.sid.school_managementback.DTO.ModuleDto;
import org.sid.school_managementback.DTO.NoteDto;
import org.sid.school_managementback.entity.Module;

import java.util.List;

public interface ModuleService extends GenericService<ModuleDto, Long>{

    List<ModuleDto> getModulesByMajorProfessorSemesterAndYear(
            Long majorId,
            Long professorId,
            String semester,
            String anneeUniversitaire);

    List<ModuleDto> getModulesByMajorAndProfessor(Long majorId, Long professorId);
    public List<ModuleDto> getModulesByMajorAndSemester(Long majorId, String semester,String anneeUniversitaire);


    List<ModuleDto> getModulesByProfesseur(Long professeurId);
}
