package org.sid.school_managementback.mapper;

import org.mapstruct.*;
import org.sid.school_managementback.DTO.PostDto;
import org.sid.school_managementback.entity.Post;

import java.util.List;

@Mapper(componentModel = "spring")
public interface PostMapper extends GenericMapper<Post, PostDto> {
    PostDto toDto(Post post);
    Post toEntity(PostDto postDTO);

}
