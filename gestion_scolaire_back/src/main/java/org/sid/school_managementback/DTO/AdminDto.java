package org.sid.school_managementback.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.sid.school_managementback.entity.RoleName;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class AdminDto extends BaseDto {


    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private RoleName role;

}
