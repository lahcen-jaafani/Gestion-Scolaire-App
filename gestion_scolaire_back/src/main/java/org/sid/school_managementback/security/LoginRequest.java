package org.sid.school_managementback.security;



import lombok.Data;

@Data
public class LoginRequest {
    private String email;
    private String password;
}
