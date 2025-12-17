package org.sid.school_managementback.serviceImpl;

import lombok.extern.slf4j.Slf4j;
import org.sid.school_managementback.DTO.UserDto;
import org.sid.school_managementback.Repository.UserRepository;
import org.sid.school_managementback.entity.RoleName;
import org.sid.school_managementback.entity.User;
import org.sid.school_managementback.mapper.GenericMapper;
import org.sid.school_managementback.mapper.UserMapper;
import org.sid.school_managementback.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementation of the UserService interface.
 */
@Slf4j
@Service
public class UserServiceImpl  {
@Autowired
private UserRepository userRepository;





    @Autowired
    private PasswordEncoder passwordEncoder;

    public void migratePasswords() {
        List<User> users = userRepository.findAll();
        for (User user : users) {
            String pwd = user.getPassword();
            if (!pwd.startsWith("$2a$") && !pwd.startsWith("$2b$") && !pwd.startsWith("$2y$")) {
                String encoded = passwordEncoder.encode(pwd);
                user.setPassword(encoded);
                userRepository.save(user);
            }
        }
    }

}
