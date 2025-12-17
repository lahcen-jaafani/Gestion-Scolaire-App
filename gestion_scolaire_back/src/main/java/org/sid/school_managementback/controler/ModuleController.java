package org.sid.school_managementback.controler;

import org.sid.school_managementback.DTO.ModuleDto;
import org.sid.school_managementback.service.ModuleService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/modules")
@CrossOrigin(origins = "*")
public class ModuleController extends GenericController<ModuleDto, Long> {

    private final ModuleService moduleService;

    public ModuleController(ModuleService moduleService) {
        super(moduleService);
        this.moduleService = moduleService;
    }

    @GetMapping("/majors/{majorId}/professors/{professorId}/modules")
    public List<ModuleDto> getModulesByMajorProfessorSemesterAndYear(
            @PathVariable Long majorId,
            @PathVariable Long professorId,
            @RequestParam String semester,
            @RequestParam String anneeUniversitaire) {

        return moduleService.getModulesByMajorProfessorSemesterAndYear(
                majorId,
                professorId,
                semester,
                anneeUniversitaire);
    }
  //  @GetMapping("/majors/{majorId}/professors/{professorId}/modules")
  //  public List<ModuleDto> getModulesByMajorAndProfessor(@PathVariable Long majorId, @PathVariable Long professorId) {
     //   return moduleService.getModulesByMajorAndProfessor(majorId, professorId);
 //   }

    @GetMapping("/professeur/{professeurId}")
    public ResponseEntity<List<ModuleDto>> getModulesByProfesseur(
            @PathVariable Long professeurId) {
        List<ModuleDto> modules = moduleService.getModulesByProfesseur(professeurId);
        return ResponseEntity.ok(modules);
    }
    @GetMapping("/{majorId}/modules")
    public ResponseEntity<List<ModuleDto>> getModulesByMajorAndSemester(
            @PathVariable Long majorId,
            @RequestParam String semester,
            @RequestParam String anneeUniversitaire) {

        List<ModuleDto> modules = moduleService.getModulesByMajorAndSemester(majorId, semester, anneeUniversitaire);
        return ResponseEntity.ok(modules);
    }
}
