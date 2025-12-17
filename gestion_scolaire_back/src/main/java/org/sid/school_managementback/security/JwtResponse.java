package org.sid.school_managementback.security;


import lombok.AllArgsConstructor;
import lombok.Data;
import org.sid.school_managementback.entity.User;

@Data
@AllArgsConstructor
public class JwtResponse {
    private String token;
    private User user;
}
