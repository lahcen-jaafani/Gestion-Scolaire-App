package org.sid.school_managementback.service;

import org.sid.school_managementback.DTO.AbsenceDto;
import org.sid.school_managementback.DTO.ModuleDto;

import java.util.List;

public interface AbsenceService extends GenericService<AbsenceDto, Long>{

    List<AbsenceDto> getAbsencesByEtudiantId(Long etudiantId);

    void saveMultiple(List<AbsenceDto> requests);

    List<AbsenceDto> getAbsencesByProfesseur(Long professeurId);
}
