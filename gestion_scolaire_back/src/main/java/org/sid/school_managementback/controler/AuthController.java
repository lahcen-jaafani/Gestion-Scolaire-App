package org.sid.school_managementback.controler;

import org.sid.school_managementback.Repository.StudentRepository;
import org.sid.school_managementback.Repository.UserRepository;
import org.sid.school_managementback.entity.RoleName;
import org.sid.school_managementback.entity.Student;
import org.sid.school_managementback.entity.User;
import org.sid.school_managementback.security.JwtUtil;
import org.sid.school_managementback.security.LoginRequest;
import org.sid.school_managementback.serviceImpl.UserDetailsServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @Autowired
    private UserRepository userRepository;
    @Autowired
    StudentRepository studentRepository;
    @Autowired
    private JwtUtil jwtUtil;


    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        // Authentification
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        // Récupérer UserDetails Spring Security
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();

        // Générer JWT
        String jwt = jwtUtil.generateToken(userDetails);

        // Charger User complet depuis la base (pour accéder à id, firstname, etc.)
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Construire la réponse
        Map<String, Object> response = new HashMap<>();
        response.put("token", jwt);

        Map<String, Object> userInfo = new HashMap<>();
        userInfo.put("id", user.getId());
        userInfo.put("firstName", user.getFirstName());
        userInfo.put("lastName", user.getLastName());
        userInfo.put("email", user.getEmail());
        userInfo.put("role", user.getRole());

        if (user.getRole() == RoleName.STUDENT) {
            Student student = studentRepository.findById(user.getId())
                    .orElseThrow(() -> new RuntimeException("Student data not found"));
            userInfo.put("majorId", student.getMajor().getId());
            userInfo.put("cne", student.getCne());
            userInfo.put("semester", student.getSemester());
            userInfo.put("NiveauScolaire", student.getNiveauScolaire());
            userInfo.put("majorId", student.getMajor().getId());
            userInfo.put("notes", student.getNotes());
            userInfo.put("majorName", student.getMajor().getNAME()); // Optionnel: ajouter le nom de la filière
        }

        response.put("user", userInfo);

        return ResponseEntity.ok(response);

    }
}