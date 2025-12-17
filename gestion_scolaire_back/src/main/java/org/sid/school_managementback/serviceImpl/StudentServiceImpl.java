package org.sid.school_managementback.serviceImpl;

import org.modelmapper.ModelMapper;
import org.sid.school_managementback.DTO.NoteDto;
import org.sid.school_managementback.DTO.StudentDto;

import org.sid.school_managementback.DTO.StudentWithNotesDTO;
import org.sid.school_managementback.Repository.StudentRepository;
import org.sid.school_managementback.entity.SessionType;
import org.sid.school_managementback.entity.Student;
import org.sid.school_managementback.mapper.StudentMapper;
import org.sid.school_managementback.service.NoteService;
import org.sid.school_managementback.service.StudentService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class StudentServiceImpl extends GenericServiceImpl<Student, StudentDto, Long> implements StudentService {
    private final StudentRepository studentRepository;
    private final StudentMapper studentMapper;
    private final BCryptPasswordEncoder passwordEncoder;
    private final NoteService noteService; // celui qui retourne List<NoteDTO>
    private final ModelMapper modelMapper;
    public StudentServiceImpl(StudentRepository studentRepository, StudentMapper studentMapper, BCryptPasswordEncoder passwordEncoder, NoteService noteService, ModelMapper modelMapper) {
        super(studentRepository, studentMapper);
        this.studentRepository = studentRepository;
        this.studentMapper = studentMapper;


        this.passwordEncoder = passwordEncoder;
        this.noteService = noteService;
        this.modelMapper = modelMapper;
    }


    @Override
    public List<StudentDto> getStudentsByYearMajorNiveau(String year, Long majorId, String niveau) {
        return studentRepository.findByYearAndMajorAndNiveau(year, majorId, niveau)
                .stream()
                .map(studentMapper::toDto)
                .collect(Collectors.toList());
    }



    @Override
    protected void setEntityId(Student entity, Long aLong) {

    }
    @Override
    public List<StudentWithNotesDTO> getStudentsWithNotesByCriteria(
            Long majorId,
            String semester,
            String anneeUniversitaire,
            Long moduleId,
            SessionType sessionType) {

        List<Student> students = studentRepository.findStudentsWithNotesByCriteria(
                majorId, semester, anneeUniversitaire, moduleId, sessionType);

        return students.stream()
                .map(student -> {
                    StudentWithNotesDTO dto = modelMapper.map(student, StudentWithNotesDTO.class);
                    dto.setMajorId(student.getMajor().getId());
                    dto.setMajorName(student.getMajor().getNAME());

                    // Filter notes based on criteria
                    List<NoteDto> filteredNotes = student.getNotes().stream()
                            .filter(note -> moduleId == null || note.getModule().getId().equals(moduleId))
                            .filter(note -> sessionType == null || note.getSessionType().equals(sessionType))
                            .map(note -> modelMapper.map(note, NoteDto.class))
                            .collect(Collectors.toList());

                    dto.setNotes(filteredNotes);
                    return dto;
                })
                .collect(Collectors.toList());
    }
    @Override
    public List<StudentWithNotesDTO> getStudentsWithNotesByCriteria2(
            Long majorId, String semester, String anneeUniversitaire,
            Long moduleId, SessionType sessionType, Long etudiantId) {

        List<Student> students = studentRepository.findStudentsWithNotesByCriteria2(
                majorId, semester, anneeUniversitaire, moduleId, sessionType, etudiantId);

        return students.stream()
                .map(student -> {
                    StudentWithNotesDTO dto = modelMapper.map(student, StudentWithNotesDTO.class);

                    // Safely handle major mapping
                    if (student.getMajor() != null) {
                        dto.setMajorId(student.getMajor().getId());
                        dto.setMajorName(student.getMajor().getNAME()); // Fixed getNAME() to getName()
                    }

                    // Filter and map notes
                    List<NoteDto> filteredNotes = student.getNotes().stream()
                            .filter(note -> {
                                boolean matchesModule = moduleId == null ||
                                        (note.getModule() != null && note.getModule().getId().equals(moduleId));
                                boolean matchesSession = sessionType == null ||
                                        note.getSessionType() == sessionType;
                                return matchesModule && matchesSession;
                            })
                            .map(note -> modelMapper.map(note, NoteDto.class))
                            .collect(Collectors.toList());

                    dto.setNotes(filteredNotes);
                    return dto;
                })
                .collect(Collectors.toList());
    }
    @Override
    public StudentDto save(StudentDto dto) {
        // Encoder le mot de passe AVANT sauvegarde
        if (dto.getPassword() != null) {
            dto.setPassword(passwordEncoder.encode(dto.getPassword()));
        }

        return super.save(dto);
    }

    @Override
    public StudentDto update(Long id, StudentDto dto) {
        if (dto.getPassword() != null) {
            dto.setPassword(passwordEncoder.encode(dto.getPassword()));
        }
        return super.update(id, dto);
    }
    @Override
    public List<Student> getStudentsByModule(Long moduleId) {
        return studentRepository.findByModuleId(moduleId);
    }

    @Override
public List<StudentDto> getStudentsByMajorAndSemester(Long majorId, String semester) {
    List<Student> students = studentRepository.findByMajorAndModuleSemester(majorId, semester);
    return students.stream()
            .map(studentMapper::toDto)
            .collect(Collectors.toList());
}



}