package org.sid.school_managementback.serviceImpl;

import org.sid.school_managementback.exception.EntityNotFoundException;
import org.sid.school_managementback.mapper.GenericMapper;
import org.sid.school_managementback.service.GenericService;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * Generic implementation of the service layer.
 * Uses MapStruct for mapping between entities and DTOs.
 *
 * @param <E> Entity type
 * @param <D> DTO type
 * @param <ID> ID type
 */
public abstract class GenericServiceImpl<E, D, ID> implements GenericService<D, ID> {

    protected final JpaRepository<E, ID> repository;
    protected final GenericMapper<E, D> mapper;

    protected GenericServiceImpl(JpaRepository<E, ID> repository, GenericMapper<E, D> mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Override
    public D save(D dto) {
        E entity = mapper.toEntity(dto);
        return mapper.toDto(repository.save(entity));
    }

    @Override
    public D findById(ID id) {
        return repository.findById(id)
                .map(mapper::toDto)
                .orElseThrow(() -> new EntityNotFoundException("Entity not found with id: " + id));
    }

    @Override
    public List<D> findAll() {
        return mapper.toDtoList(repository.findAll());
    }

    @Override
    public void delete(ID id) {
        repository.deleteById(id);
    }
    @Override
    public D update(ID id, D dto) {
        E existingEntity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Entity not found for update"));

        mapper.updateEntityFromDto(dto, existingEntity); // <-- mise à jour sur l'existant

        E saved = repository.save(existingEntity);
        return mapper.toDto(saved);
    }

    /**
     * Méthode à redéfinir dans les sous-classes pour affecter l'ID à l'entité.
     */
    protected abstract void setEntityId(E entity, ID id);
}
