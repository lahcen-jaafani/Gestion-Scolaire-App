package org.sid.school_managementback.controler;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.sid.school_managementback.DTO.AbsenceDto;
import org.sid.school_managementback.DTO.NoteDto;
import org.sid.school_managementback.Repository.AbsenceRepository;
import org.sid.school_managementback.Repository.StudentRepository;
import org.sid.school_managementback.entity.Absence;
import org.sid.school_managementback.service.AbsenceService;
import org.sid.school_managementback.service.ModuleService;
import org.sid.school_managementback.service.NoteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.util.List;

@RestController
@RequestMapping("/api/absences")
@CrossOrigin(origins = "*")
public class AbsenceController extends GenericController<AbsenceDto, Long> {

    private final AbsenceService absenceService;
    private final AbsenceRepository absenceRepository;
    private final StudentRepository studentRepository;

    public AbsenceController(AbsenceService absenceService, AbsenceRepository absenceRepository, StudentRepository studentRepository) {
        super(absenceService);
        this.absenceService = absenceService;
        this.absenceRepository = absenceRepository;
        this.studentRepository = studentRepository;
    }
    @PostMapping("/save-multiple")
    public ResponseEntity<?> saveMultiple(@RequestBody List<AbsenceDto> requests) {
        absenceService.saveMultiple(requests);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/etudiant/{id}")
    public List<AbsenceDto> getAbsencesByEtudiantId(@PathVariable Long id) {
        return absenceService.getAbsencesByEtudiantId(id);
    }
    @GetMapping("/by-professor/{id}")
    public List<AbsenceDto> getAbsencesByProf(@PathVariable Long id) {
        return absenceService.getAbsencesByProfesseur(id);
    }

}