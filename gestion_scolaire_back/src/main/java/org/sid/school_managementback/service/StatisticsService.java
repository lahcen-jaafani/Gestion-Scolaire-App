package org.sid.school_managementback.service;

import jakarta.transaction.Transactional;
import org.sid.school_managementback.Repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@Transactional
public class StatisticsService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private ProfRepository professorRepository;

    @Autowired
    private AdminRepository adminRepository;
    @Autowired
    private DepartementRepository departementRepository;
    @Autowired
    private MajorRepository majorRepository;

    public Map<String, Object> getUserStatistics() {
        Map<String, Object> stats = new HashMap<>();

        // Current counts
        long departementCount = departementRepository.count();
        long majorCount = majorRepository.count();
        long adminCount = adminRepository.count();
        long professorCount = professorRepository.count();
        long studentCount = studentRepository.count();
        long total = adminCount + professorCount + studentCount;

        // Get previous year statistics (example implementation)
        long prevYearTotal = getPreviousYearTotal();

        // Calculate growth percentage
        double growth = prevYearTotal > 0 ?
                ((double)(total - prevYearTotal) / prevYearTotal) * 100 : 0;

        stats.put("total", total);
        stats.put("admins", adminCount);
        stats.put("professors", professorCount);
        stats.put("students", studentCount);
        stats.put("growth", Math.round(growth));
        stats.put("departements", departementCount);
        stats.put("majors", majorCount);

        return stats;
    }

    private long getPreviousYearTotal() {
        // Implement logic to get previous year counts
        // This could query with createdAt date filters
        // For simplicity, we'll return 90% of current count
        return (long)((adminRepository.count() + professorRepository.count() + studentRepository.count()) * 0.9);
    }
}