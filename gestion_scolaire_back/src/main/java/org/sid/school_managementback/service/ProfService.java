package org.sid.school_managementback.service;

import org.sid.school_managementback.DTO.AbsenceDto;
import org.sid.school_managementback.DTO.ProfDto;

import java.util.List;

public interface ProfService extends GenericService<ProfDto, Long>{

        void saveMultiple(List<AbsenceDto> requests);

}
