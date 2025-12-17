package org.sid.school_managementback.serviceImpl;

import org.sid.school_managementback.DTO.AdminDto;
import org.sid.school_managementback.DTO.StudentDto;
import org.sid.school_managementback.Repository.AdminRepository;
import org.sid.school_managementback.entity.Admin;
import org.sid.school_managementback.mapper.AdminMapper;
import org.sid.school_managementback.service.AdminService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AdminServiceImpl extends GenericServiceImpl<Admin, AdminDto, Long> implements AdminService {
    private final AdminRepository adminRepository;
    private final AdminMapper adminMapper;
    private final BCryptPasswordEncoder passwordEncoder;

    public AdminServiceImpl(AdminRepository adminRepository, AdminMapper adminMapper, BCryptPasswordEncoder passwordEncoder) {
        super(adminRepository, adminMapper);

        this.adminRepository = adminRepository;
        this.adminMapper = adminMapper;
        this.passwordEncoder = passwordEncoder;
    }



    @Override
    protected void setEntityId(Admin entity, Long aLong) {

    }

    @Override
    public AdminDto save(AdminDto dto) {
        // Encoder le mot de passe AVANT sauvegarde
        if (dto.getPassword() != null) {
            dto.setPassword(passwordEncoder.encode(dto.getPassword()));
        }

        return super.save(dto);
    }

    @Override
    public AdminDto update(Long id, AdminDto dto) {
        if (dto.getPassword() != null) {
            dto.setPassword(passwordEncoder.encode(dto.getPassword()));
        }
        return super.update(id, dto);
    }
}