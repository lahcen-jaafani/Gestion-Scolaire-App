package org.sid.school_managementback.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.sid.school_managementback.DTO.NoteDto;
import org.sid.school_managementback.DTO.PostDto;
import org.sid.school_managementback.entity.Note;
import org.sid.school_managementback.entity.Post;
@Mapper(componentModel = "spring")
public interface NoteMapper extends GenericMapper<Note, NoteDto> {
    @Mapping(source = "professeur.id", target = "professeurId")
    @Mapping(source = "etudiant.id", target = "etudiantId")
    @Mapping(source = "module.id", target = "moduleId")
    NoteDto toDto(Note note);

    @Mapping(source = "professeurId", target = "professeur.id")
    @Mapping(source = "etudiantId", target = "etudiant.id")
    @Mapping(source = "moduleId", target = "module.id")
    Note toEntity(NoteDto dto);
}
