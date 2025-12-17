package org.sid.school_managementback.service;

import org.sid.school_managementback.DTO.MajorDto;
import org.sid.school_managementback.DTO.MajorStudentCountDTO;
import org.sid.school_managementback.DTO.PostDto;
import org.sid.school_managementback.entity.Major;

import java.util.List;

public interface MajorService extends GenericService<MajorDto, Long>{


    List<MajorStudentCountDTO> getStudentCountPerMajor(String year);

    Major getEntityById(Long id);
    List<MajorDto> getMajorsByDepartementId(Long departementId);

    List<MajorDto> getMajorsByProfessor(Long professorId);
}
