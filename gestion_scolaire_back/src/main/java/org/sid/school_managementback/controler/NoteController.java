package org.sid.school_managementback.controler;

import org.sid.school_managementback.DTO.ModuleDto;
import org.sid.school_managementback.DTO.NoteDto;
import org.sid.school_managementback.DTO.NoteRequestDTO;
import org.sid.school_managementback.Repository.NoteRepository;
import org.sid.school_managementback.entity.Note;
import org.sid.school_managementback.entity.SessionType;
import org.sid.school_managementback.service.ModuleService;
import org.sid.school_managementback.service.NoteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notes")
@CrossOrigin(origins = "*")
public class NoteController extends GenericController<NoteDto, Long> {

    private final NoteService noteService;
    private final NoteRepository noteRepository;

    public NoteController(NoteService noteService, NoteRepository noteRepository) {
        super(noteService);
        this.noteService = noteService;

        this.noteRepository = noteRepository;
    }

    @GetMapping("/module/{moduleId}")
    public ResponseEntity<List<Note>> getNotesByModule(@PathVariable Long moduleId) {
        List<Note> notes = noteRepository.findByModuleId(moduleId);
        return ResponseEntity.ok(notes);
    }
    @GetMapping("/by-professor-major-semester")
    public ResponseEntity<List<Note>> getNotesByProfessorAndMajorAndSemester(
            @RequestParam Long professorId,
            @RequestParam Long majorId,
            @RequestParam String semester,
            @RequestParam SessionType sessionType
    ) {
        List<Note> notes = noteService.getNotesByProfessorAndMajorAndSemester(
                professorId,
                majorId,
                semester,
                sessionType
        );
        return ResponseEntity.ok(notes);
    }
    @GetMapping("/module/{moduleId}/session/{sessionType}")
    public List<Note> getNotesByModuleAndSession(
            @PathVariable Long moduleId,
            @PathVariable String sessionType) {
        return noteService.getNotesByModuleAndSessionType(moduleId, sessionType);
    }
    @PostMapping("/batch")
    public ResponseEntity<?> saveMultipleNotes(
            @RequestBody List<NoteDto> noteDTOs,
            @RequestHeader("X-Professeurs-Id") Long professeurId) {
        try {
            // Validate input
            if (noteDTOs == null || noteDTOs.isEmpty()) {
                return ResponseEntity.badRequest().body("La liste des notes est vide");
            }

            // Check if all notes are for the same module and same session type
            Long moduleId = noteDTOs.get(0).getModuleId();
            SessionType sessionType = noteDTOs.get(0).getSessionType();

            boolean allSameModuleAndSession = noteDTOs.stream()
                    .allMatch(dto -> dto.getModuleId().equals(moduleId)
                            && dto.getSessionType() == sessionType);

            if (!allSameModuleAndSession) {
                return ResponseEntity.badRequest().body("Toutes les notes doivent être pour le même module et la même session");
            }

            List<Note> savedNotes = noteService.saveMultipleNotes(noteDTOs, professeurId);

            // Return simplified response
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Notes enregistrées avec succès");
            response.put("count", savedNotes.size());
            response.put("moduleId", moduleId);
            response.put("sessionType", sessionType);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    Map.of(
                            "error", "Erreur lors de l'enregistrement",
                            "message", e.getMessage(),
                            "timestamp", LocalDateTime.now()
                    )
            );
        }
    }
    @PostMapping("/cc")
    public ResponseEntity<?> saveCCNotes(@RequestBody NoteRequestDTO noteRequest) {
        try {
            noteService.saveOrUpdateNotes(noteRequest);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}