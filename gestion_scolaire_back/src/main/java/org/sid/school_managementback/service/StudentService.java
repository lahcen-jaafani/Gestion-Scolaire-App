package org.sid.school_managementback.service;

import org.sid.school_managementback.DTO.ProfDto;
import org.sid.school_managementback.DTO.StudentDto;

import org.sid.school_managementback.DTO.StudentWithNotesDTO;
import org.sid.school_managementback.entity.SessionType;
import org.sid.school_managementback.entity.Student;

import java.util.List;

public interface StudentService extends GenericService<StudentDto, Long>{


    List<StudentDto> getStudentsByYearMajorNiveau(String year, Long majorId, String niveau);


    List<StudentWithNotesDTO> getStudentsWithNotesByCriteria(
            Long majorId,
            String semester,
            String anneeUniversitaire,
            Long moduleId,
            SessionType sessionType);

    List<StudentWithNotesDTO> getStudentsWithNotesByCriteria2(
            Long majorId,
            String semester,
            String anneeUniversitaire,
            Long moduleId,
            SessionType sessionType,
            Long etudiantId);

    List<Student> getStudentsByModule(Long moduleId);

    List<StudentDto> getStudentsByMajorAndSemester(Long majorId, String semester);
}
