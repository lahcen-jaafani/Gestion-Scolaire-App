package org.sid.school_managementback;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories(basePackages = "org.sid.school_managementback.Repository")
@EntityScan(basePackages = "org.sid.school_managementback.entity")
public class SchoolManagementBackApplication {

    public static void main(String[] args) {
        SpringApplication.run(SchoolManagementBackApplication.class, args);
    }

}
