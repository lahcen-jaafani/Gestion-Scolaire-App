package org.sid.school_managementback.serviceImpl;

import org.sid.school_managementback.DTO.DepartementDTO;
import org.sid.school_managementback.DTO.MajorDto;
import org.sid.school_managementback.Repository.DepartementRepository;
import org.sid.school_managementback.Repository.MajorRepository;
import org.sid.school_managementback.entity.Departement;
import org.sid.school_managementback.entity.Major;
import org.sid.school_managementback.mapper.DepartementMapper;
import org.sid.school_managementback.mapper.MajorMapper;
import org.sid.school_managementback.service.DepartementService;
import org.sid.school_managementback.service.MajorService;
import org.springframework.stereotype.Service;

@Service
public class DepartementServiceImpl extends GenericServiceImpl<Departement, DepartementDTO, Long> implements DepartementService {

    private final DepartementRepository departementRepository;
    private final DepartementMapper departementMapper;

    public DepartementServiceImpl(DepartementRepository departementRepository, DepartementMapper departementMapper) {
        super(departementRepository,departementMapper);
        this.departementRepository = departementRepository;
        this.departementMapper = departementMapper;
    }


    @Override
    protected void setEntityId(Departement entity, Long aLong) {

    }
}