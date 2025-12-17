package org.sid.school_managementback.controler;

import org.sid.school_managementback.DTO.ProfDto;
import org.sid.school_managementback.entity.Professor;
import org.sid.school_managementback.entity.RoleName;
import org.sid.school_managementback.service.ProfService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/prof")
@CrossOrigin(origins = "*")
public class ProfController extends GenericController<ProfDto, Long> {

    private final ProfService profService;
    public ProfController(ProfService profService) {
        super(profService);
        this.profService = profService;
    }


}