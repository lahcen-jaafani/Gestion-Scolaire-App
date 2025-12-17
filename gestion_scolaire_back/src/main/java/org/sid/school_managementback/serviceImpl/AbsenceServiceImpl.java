package org.sid.school_managementback.serviceImpl;

import jakarta.persistence.EntityNotFoundException;
import org.sid.school_managementback.DTO.AbsenceDto;
import org.sid.school_managementback.Repository.AbsenceRepository;
import org.sid.school_managementback.Repository.ModuleRepository;
import org.sid.school_managementback.Repository.StudentRepository;

import org.sid.school_managementback.entity.Absence;
import org.sid.school_managementback.entity.Student;
import org.sid.school_managementback.mapper.AbsenceMapper;
import org.sid.school_managementback.service.AbsenceService;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class AbsenceServiceImpl extends GenericServiceImpl<Absence, AbsenceDto, Long> implements AbsenceService{

    private final AbsenceRepository absenceRepository;
    private final AbsenceMapper absenceMapper;


    private final ModuleRepository moduleRepository;
    private final StudentRepository userRepository;

    public AbsenceServiceImpl(AbsenceRepository absenceRepository, AbsenceMapper absenceMapper, ModuleRepository moduleRepository, StudentRepository userRepository) {
        super(absenceRepository, absenceMapper);
        this.absenceRepository = absenceRepository;
        this.absenceMapper = absenceMapper;
        this.moduleRepository = moduleRepository;
        this.userRepository = userRepository;
    }


    @Override
    protected void setEntityId(Absence entity, Long aLong) {

    }
@Override
public List<AbsenceDto> getAbsencesByEtudiantId(Long etudiantId) {
    List<Absence> absences = absenceRepository.findByEtudiantId(etudiantId);
    return absences.stream().map(absenceMapper::toDto).toList();
}


    @Override
    public void saveMultiple(List<AbsenceDto> requests) {
        for (AbsenceDto req : requests) {
            if (req.getEtudiantId() == null || req.getModuleId() == null) {
                throw new IllegalArgumentException("L'ID de l'étudiant et du module sont obligatoires.");
            }

            Absence absence = new Absence();

            absence.setEtudiant(
                    (Student) userRepository.findById(req.getEtudiantId()).orElseThrow(() ->
                            new EntityNotFoundException("Étudiant non trouvé avec l'id: " + req.getEtudiantId()))
            );

            absence.setModule(
                    moduleRepository.findById(req.getModuleId()).orElseThrow(() ->
                            new EntityNotFoundException("Module non trouvé avec l'id: " + req.getModuleId()))
            );

            absence.setDate(req.getDate() != null ? req.getDate() : LocalDate.now());

            // Set the time slot if provided
            absence.setTimeSlot(req.getTimeSlot() != null ? req.getTimeSlot() : "AM"); // or default to "AM" or anything you want

            absence.setJustification("non justifiè");

            absenceRepository.save(absence);
        }
    }
    @Override
    public List<AbsenceDto> getAbsencesByProfesseur(Long professeurId) {
        List<Absence> absences = absenceRepository.findByModule_Professeur_Id(professeurId);
        return absences.stream().map(absenceMapper::toDto).toList();
    }


}