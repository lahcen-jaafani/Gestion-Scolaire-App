package org.sid.school_managementback.DTO;

public class MajorStudentCountDTO {
    private Long majorId;
    private String majorName;
    private Long studentCount;

    // Constructor
    public MajorStudentCountDTO(Long majorId, String majorName, Long studentCount) {
        this.majorId = majorId;
        this.majorName = majorName;
        this.studentCount = studentCount;
    }

    // Getters and Setters
    public Long getMajorId() {
        return majorId;
    }

    public void setMajorId(Long majorId) {
        this.majorId = majorId;
    }

    public String getMajorName() {
        return majorName;
    }

    public void setMajorName(String majorName) {
        this.majorName = majorName;
    }

    public Long getStudentCount() {
        return studentCount;
    }

    public void setStudentCount(Long studentCount) {
        this.studentCount = studentCount;
    }
}