package org.sid.school_managementback.service;

import jakarta.transaction.Transactional;
import org.sid.school_managementback.DTO.NoteDto;
import org.sid.school_managementback.DTO.NoteRequestDTO;
import org.sid.school_managementback.DTO.PostDto;
import org.sid.school_managementback.entity.Note;
import org.sid.school_managementback.entity.SessionType;

import java.util.List;

public interface NoteService extends GenericService<NoteDto, Long> {



    @Transactional
    void saveOrUpdateNotes(NoteRequestDTO noteRequest);

    List<Note> getNotesByModuleAndSessionType(Long moduleId, String sessionType);

    List<Note> getNotesByProfessorAndMajorAndSemester(
            Long professorId,
            Long majorId,
            String semester,
            SessionType sessionType
    );

    @Transactional
    List<Note> saveMultipleNotes(List<NoteDto> noteDTOs, Long professeurId);


}