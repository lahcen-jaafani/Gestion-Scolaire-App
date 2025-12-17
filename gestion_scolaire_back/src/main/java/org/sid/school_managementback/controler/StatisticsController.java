package org.sid.school_managementback.controler;

import org.sid.school_managementback.service.StatisticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/statistics")
@CrossOrigin("*")
public class StatisticsController {

    @Autowired
    private StatisticsService statisticsService;

    @GetMapping("/users")
    public ResponseEntity<Map<String, Object>> getUserStatistics() {
        Map<String, Object> stats = statisticsService.getUserStatistics();
        return ResponseEntity.ok(stats);
    }
}