package org.sid.school_managementback;

import org.sid.school_managementback.Repository.AdminRepository;
import org.sid.school_managementback.entity.Admin;
import org.sid.school_managementback.entity.RoleName;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
@EnableJpaRepositories(basePackages = "org.sid.school_managementback.Repository")
@EntityScan(basePackages = "org.sid.school_managementback.entity")
public class SchoolManagementBackApplication {

    public static void main(String[] args) {
        SpringApplication.run(SchoolManagementBackApplication.class, args);
    }
    @Bean
    CommandLineRunner initAdmin(
            AdminRepository adminRepository,
            PasswordEncoder passwordEncoder
    ) {
        return args -> {

            String adminEmail = "admin@school.com";

            // Vérifier si l'admin existe déjà
            if (adminRepository.findByEmail(adminEmail).isEmpty()) {

                Admin admin = new Admin();
                admin.setFirstName("Super");
                admin.setLastName("Admin");
                admin.setEmail(adminEmail);
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setRole(RoleName.ADMINISTRATOR); // enum
                admin.setPhoneNumber("0600000000");

                adminRepository.save(admin);

                System.out.println("✅ Admin account created successfully");
            } else {
                System.out.println("ℹ️ Admin already exists");
            }
        };
    }
}
