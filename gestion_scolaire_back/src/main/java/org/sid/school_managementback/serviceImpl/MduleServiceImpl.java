package org.sid.school_managementback.serviceImpl;

import org.modelmapper.ModelMapper;
import org.sid.school_managementback.DTO.ModuleDto;
import org.sid.school_managementback.Repository.ModuleRepository;
import org.sid.school_managementback.entity.Module;
import org.sid.school_managementback.mapper.ModuleMapper;
import org.sid.school_managementback.service.ModuleService;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MduleServiceImpl extends GenericServiceImpl<Module, ModuleDto, Long> implements ModuleService {

    private final ModuleRepository moduleRepository;
    private final ModuleMapper moduleMapper;
    private final ModelMapper modelMapper;
    public MduleServiceImpl(ModuleRepository moduleRepository, ModuleMapper moduleMapper, ModelMapper modelMapper) {
        super(moduleRepository, moduleMapper);
        this.moduleRepository = moduleRepository;
        this.moduleMapper = moduleMapper;
        this.modelMapper = modelMapper;
    }
    @Override
    public List<ModuleDto> getModulesByMajorAndSemester(Long majorId, String semester, String anneeUniversitaire) {
        List<Module> modules = moduleRepository.findByMajorIdAndSemesterAndAnneeUniversitaire(majorId, semester, anneeUniversitaire);
        return modules.stream()
                .map(moduleMapper::toDto)
                .collect(Collectors.toList());
    }


    @Override
    public List<ModuleDto> getModulesByMajorProfessorSemesterAndYear(
            Long majorId,
            Long professorId,
            String semester,
            String anneeUniversitaire) {

        List<Module> modules = moduleRepository.findByMajorIdAndProfesseurIdAndSemesterAndAnneeUniversitaire(
                majorId,
                professorId,
                semester,
                anneeUniversitaire);

        return modules.stream()
                .map(moduleMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<ModuleDto> getModulesByMajorAndProfessor(Long majorId, Long professorId) {
        List<Module> modules = moduleRepository.findByMajorIdAndProfesseurId(majorId, professorId);
        return modules.stream()
                .map(moduleMapper::toDto)
                .collect(Collectors.toList());
    }
@Override
public List<ModuleDto> getModulesByProfesseur(Long professeurId) {
    List<Module> modules = moduleRepository.findByProfesseurId(professeurId);
    return modules.stream()
            .map(module -> modelMapper.map(module, ModuleDto.class))
            .collect(Collectors.toList());
}

    @Override
    protected void setEntityId(Module entity, Long aLong) {
        entity.setId(aLong);
    }



}
