package org.sid.school_managementback.serviceImpl;

import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.sid.school_managementback.DTO.NoteDto;
import org.sid.school_managementback.DTO.NoteRequestDTO;
import org.sid.school_managementback.Repository.*;
import org.sid.school_managementback.entity.*;
import org.sid.school_managementback.entity.Module;
import org.sid.school_managementback.mapper.NoteMapper;
import org.sid.school_managementback.service.NoteService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class NoteServiceImpl extends GenericServiceImpl<Note, NoteDto, Long> implements NoteService {
    private final NoteRepository noteRepository;
    private final ModelMapper modelMapper;
    private final StudentRepository etudiantRepository;
    private final ModuleRepository moduleRepository;
    private final ProfRepository professeurRepository;


    private final NoteMapper noteMapper;
private final StudentRepository studentRepository;
    public NoteServiceImpl(NoteRepository noteRepository, ModelMapper modelMapper, StudentRepository etudiantRepository, ModuleRepository moduleRepository, ProfRepository professeurRepository, NoteMapper noteMapper, StudentRepository studentRepository) {
        super(noteRepository,noteMapper);
        this.noteRepository = noteRepository;
        this.modelMapper = modelMapper;
        this.etudiantRepository = etudiantRepository;
        this.moduleRepository = moduleRepository;
        this.professeurRepository = professeurRepository;
        this.noteMapper = noteMapper;
        this.studentRepository = studentRepository;
    }


    @Transactional
    @Override
    public void saveOrUpdateNotes(NoteRequestDTO noteRequest) {
        // Vérifier si des notes existent déjà pour cet étudiant et module
        Optional<Note> existingCC1 = noteRepository.findByStudentAndModuleAndExamType(
                noteRequest.getStudentId(),
                noteRequest.getModuleId(),
                ExamType.CC1);

        Optional<Note> existingCC2 = noteRepository.findByStudentAndModuleAndExamType(
                noteRequest.getStudentId(),
                noteRequest.getModuleId(),
                ExamType.CC2);

        // Enregistrer ou mettre à jour CC1
        Note noteCC1 = existingCC1.orElse(new Note());
        noteCC1.setEtudiant(studentRepository.findById(noteRequest.getStudentId()).orElseThrow());
        noteCC1.setModule(moduleRepository.findById(noteRequest.getModuleId()).orElseThrow());
        noteCC1.setExamType(ExamType.CC1);
        noteCC1.setCc1(noteRequest.getCc1());
        noteRepository.save(noteCC1);

        // Enregistrer ou mettre à jour CC2
        Note noteCC2 = existingCC2.orElse(new Note());
        noteCC2.setEtudiant(studentRepository.findById(noteRequest.getStudentId()).orElseThrow());
        noteCC2.setModule(moduleRepository.findById(noteRequest.getModuleId()).orElseThrow());
        noteCC2.setExamType(ExamType.CC2);
        noteCC2.setCc2(noteRequest.getCc2());
        noteRepository.save(noteCC2);
    }

    @Override
    public List<Note> getNotesByModuleAndSessionType(Long moduleId, String sessionType) {
        return noteRepository.findByModuleIdAndSessionType(moduleId, SessionType.valueOf(sessionType));
    }
    @Override
    public List<Note> getNotesByProfessorAndMajorAndSemester(
            Long professorId,
            Long majorId,
            String semester,
            SessionType sessionType
    ) {
        return noteRepository.findByProfessorAndMajorAndSemesterAndSessionType(
                professorId,
                majorId,
                semester,
                sessionType
        );
    }

    @Transactional
    @Override
    public List<Note> saveMultipleNotes(List<NoteDto> noteDTOs, Long professeurId) {
        if (noteDTOs.isEmpty()) {
            throw new RuntimeException("Aucune note à enregistrer");
        }

        // Verify professor exists
        Professor professeur = professeurRepository.findById(professeurId)
                .orElseThrow(() -> new RuntimeException("Professeur non trouvé"));

        // Get module ID and session type from first note (all notes should be for same module and session)
        Long moduleId = noteDTOs.get(0).getModuleId();
        SessionType sessionType = noteDTOs.get(0).getSessionType();

        Module module = moduleRepository.findById(moduleId)
                .orElseThrow(() -> new RuntimeException("Module non trouvé"));

        // Check if notes already exist for this module and session
        if (noteRepository.existsByModuleIdAndSessionType(moduleId, sessionType)) {
            throw new RuntimeException("Les notes pour ce module et cette session existent déjà.");
        }

        List<Note> notes = new ArrayList<>();

        for (NoteDto dto : noteDTOs) {
            // Verify student exists
            Student etudiant = etudiantRepository.findById(dto.getId())
                    .orElseThrow(() -> new RuntimeException("Étudiant non trouvé avec ID: " + dto.getId()));

            // Check if note already exists for this student, module and session
            if (noteRepository.existsByEtudiantIdAndModuleIdAndSessionType(
                    dto.getId(), moduleId, sessionType)) {
                throw new RuntimeException("Note existe déjà pour l'étudiant: " + etudiant.getLastName());
            }

            Note note = new Note();
            note.setExamType(dto.getExamtype());
            note.setSessionType(sessionType);
            note.setEtudiant(etudiant);
            note.setModule(module);
            note.setProfesseur(professeur);

            if (sessionType == SessionType.NORMAL) {
                handleNormalSession(dto, note);
            } else { // RATTRAPAGE
                handleRetakeSession(dto, note);
            }

            // Set "Notes incomplètes" only if no valid grades were provided

            notes.add(note);
        }

        return noteRepository.saveAll(notes);
    }

    private void handleNormalSession(NoteDto dto, Note note) {
        note.setCc1(dto.getCc1());
        note.setCc2(dto.getCc2());
        note.setNr(null);

        if (dto.getCc1() != null && dto.getCc2() != null) {
            double moyenne = (dto.getCc1() + dto.getCc2()) / 2;
            note.setMoyenne(moyenne);

            if (moyenne < 5) {
                note.setObservation("Non validé");
            } else if (moyenne < 10) {
                note.setObservation("Rattrapage");
            } else {
                note.setObservation("Validé");
            }
        }
    }

    private void handleRetakeSession(NoteDto dto, Note note) {
        note.setCc1(null);
        note.setCc2(null);
        note.setNr(dto.getNr());

        if (dto.getNr() != null) {
            note.setMoyenne(dto.getNr());

            if (dto.getNr() >= 10) {
                note.setObservation("Validé (Rattrapage)");
            } else {
                note.setObservation("Non validé (Rattrapage)");
            }
        }
    }

    @Override
    protected void setEntityId(Note entity, Long aLong) {

    }






}