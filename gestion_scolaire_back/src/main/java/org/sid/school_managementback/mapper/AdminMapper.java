
package org.sid.school_managementback.mapper;

import org.mapstruct.*;
import org.sid.school_managementback.DTO.AdminDto;
import org.sid.school_managementback.entity.Admin;

@Mapper(componentModel = "spring")
public interface AdminMapper extends GenericMapper<Admin, AdminDto> {
    AdminDto toDto(Admin admin);
    @InheritInverseConfiguration
    Admin toEntity(AdminDto dto);
}
