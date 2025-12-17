package org.sid.school_managementback.controler;

import org.sid.school_managementback.DTO.AdminDto;
import org.sid.school_managementback.service.AdminService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController extends GenericController<AdminDto, Long> {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        super(adminService);
        this.adminService = adminService;

    }

}