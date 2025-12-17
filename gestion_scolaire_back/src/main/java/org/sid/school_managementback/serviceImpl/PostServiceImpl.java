package org.sid.school_managementback.serviceImpl;

import org.sid.school_managementback.DTO.PostDto;
import org.sid.school_managementback.Repository.PostRepository;
import org.sid.school_managementback.entity.Post;
import org.sid.school_managementback.mapper.PostMapper;
import org.sid.school_managementback.service.PostService;
import org.springframework.stereotype.Service;

@Service
public class PostServiceImpl extends GenericServiceImpl<Post, PostDto, Long> implements PostService {
    private final PostRepository postRepository;
    private final PostMapper postMapper;

    public PostServiceImpl(PostRepository postRepository, PostMapper postMapper) {
        super(postRepository, postMapper);
        this.postRepository = postRepository;
        this.postMapper = postMapper;
    }

    @Override
    protected void setEntityId(Post entity, Long id) {
        entity.setId(id);
    }
}