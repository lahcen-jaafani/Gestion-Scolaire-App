package org.sid.school_managementback.DTO;



import lombok.Data;

@Data
public class ResetPasswordRequest {
    private String email;
    private String newPassword;
    private String token;

}

