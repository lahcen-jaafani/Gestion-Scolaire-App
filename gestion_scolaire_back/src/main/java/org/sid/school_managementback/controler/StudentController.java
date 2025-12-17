package org.sid.school_managementback.controler;

import org.sid.school_managementback.DTO.StudentDto;


import org.sid.school_managementback.DTO.StudentWithNotesDTO;
import org.sid.school_managementback.Repository.NoteRepository;
import org.sid.school_managementback.Repository.StudentRepository;
import org.sid.school_managementback.entity.SessionType;
import org.sid.school_managementback.entity.Student;
import org.sid.school_managementback.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/student")
@CrossOrigin(origins = "*")
public class StudentController extends GenericController<StudentDto, Long> {
    private final NoteRepository noteRepository;
    private final StudentService studentService;

    private final StudentRepository studentRepository;

    @Autowired
    StudentRepository std;

    public StudentController(NoteRepository noteRepository, StudentService studentService, StudentRepository studentRepository) {
        super(studentService);
        this.noteRepository = noteRepository;
        this.studentService = studentService;


        this.studentRepository = studentRepository;
    }
    @GetMapping("/with-note")
    public ResponseEntity<List<StudentWithNotesDTO>> getStudentsWithNotes(
            @RequestParam(required = false) Long majorId,
            @RequestParam(required = false) String semester,
            @RequestParam(required = false) String anneeUniversitaire,
            @RequestParam(required = false) Long moduleId,
            @RequestParam(required = false) SessionType sessionType,
            @RequestParam(required = false) Long etudiantId) {

        List<StudentWithNotesDTO> result = studentService.getStudentsWithNotesByCriteria2(
                majorId, semester, anneeUniversitaire, moduleId, sessionType, etudiantId);

        return ResponseEntity.ok(result);
    }
    @GetMapping("/with-notes")
    public ResponseEntity<List<StudentWithNotesDTO>> getStudentsWithNotesByCriteria(
            @RequestParam Long majorId,
            @RequestParam String semester,
            @RequestParam String anneeUniversitaire,
            @RequestParam(required = false) Long moduleId,
            @RequestParam(required = false) SessionType sessionType) {

        List<StudentWithNotesDTO> students = studentService.getStudentsWithNotesByCriteria(
                majorId, semester, anneeUniversitaire, moduleId, sessionType);

        return ResponseEntity.ok(students);
    }

    @GetMapping("/by-major-semester")
    public ResponseEntity<List<StudentDto>> getStudentsByMajorAndSemester(
            @RequestParam Long majorId,
            @RequestParam String semester) {

        List<StudentDto> students = studentService.getStudentsByMajorAndSemester(majorId, semester);
        return ResponseEntity.ok(students);
    }
    @GetMapping("/module/{moduleId}")
    public ResponseEntity<List<Student>> getStudentsByModule(
            @PathVariable Long moduleId) {

        List<Student> students = studentService.getStudentsByModule(moduleId);

        if (students.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(students);
    }

    @GetMapping("/by-year-major-niveau")
    public ResponseEntity<List<StudentDto>> getByYearMajorNiveau(
            @RequestParam String year,
            @RequestParam Long majorId,
            @RequestParam String niveau) {
        List<StudentDto> students = studentService.getStudentsByYearMajorNiveau(year, majorId, niveau);
        return ResponseEntity.ok(students);
    }

}