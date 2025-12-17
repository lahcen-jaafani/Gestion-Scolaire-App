package org.sid.school_managementback.mapper;

import org.mapstruct.BeanMapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

/**
 * Generic mapper interface for mapping between entity and DTO objects.
 *
 * @param <E> Entity type
 * @param <D> DTO type
 */
public interface GenericMapper<E, D> {

    /**
     * Maps an entity to a DTO.
     *
     * @param entity the entity to map
     * @return the mapped DTO
     */
    D toDto(E entity);

    /**
     * Maps a DTO to an entity.
     *
     * @param dto the DTO to map
     * @return the mapped entity
     */
    E toEntity(D dto);

    /**
     * Maps a list of entities to a list of DTOs.
     *
     * @param entities the entities to map
     * @return the mapped DTOs
     */
    java.util.List<D> toDtoList(java.util.List<E> entities);

    /**
     * Maps a list of DTOs to a list of entities.
     *
     * @param dtos the DTOs to map
     * @return the mapped entities
     */
    java.util.List<E> toEntityList(java.util.List<D> dtos);

    /**
     * Updates an entity with the data from a DTO.
     * Ignores null values in the DTO.
     *
     * @param dto the DTO with the new data
     * @param entity the entity to update
     * @return the updated entity
     */
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    E updateEntityFromDto(D dto, @MappingTarget E entity);

}