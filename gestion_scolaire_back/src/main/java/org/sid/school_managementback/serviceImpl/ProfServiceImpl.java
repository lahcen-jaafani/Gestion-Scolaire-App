package org.sid.school_managementback.serviceImpl;

import org.sid.school_managementback.DTO.AbsenceDto;
import org.sid.school_managementback.DTO.ProfDto;
import org.sid.school_managementback.Repository.ProfRepository;
import org.sid.school_managementback.entity.Professor;
import org.sid.school_managementback.mapper.ProfessorMapper;
import org.sid.school_managementback.service.ProfService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service

public class ProfServiceImpl extends GenericServiceImpl<Professor, ProfDto, Long> implements ProfService {
    private final ProfRepository profRepository;
    private final ProfessorMapper professorMapper;
    private final BCryptPasswordEncoder passwordEncoder;

    public ProfServiceImpl(ProfRepository profRepository, ProfessorMapper professorMapper, BCryptPasswordEncoder passwordEncoder) {
        super(profRepository, professorMapper);
        this.profRepository = profRepository;
        this.professorMapper = professorMapper;


        this.passwordEncoder = passwordEncoder;
    }








    @Override
    public void saveMultiple(List<AbsenceDto> requests) {

    }

    @Override
    protected void setEntityId(Professor entity, Long aLong) {

    }
    @Override
    public ProfDto save(ProfDto dto) {
        // Encoder le mot de passe AVANT sauvegarde
        if (dto.getPassword() != null) {
            dto.setPassword(passwordEncoder.encode(dto.getPassword()));
        }

        return super.save(dto);
    }

    @Override
    public ProfDto update(Long id, ProfDto dto) {
        if (dto.getPassword() != null) {
            dto.setPassword(passwordEncoder.encode(dto.getPassword()));
        }
        return super.update(id, dto);
    }

}