package com.example.uniCompass.dto.request;

import lombok.Data;

@Data
public class AcademicsUpdateRequest {
    private Double gpa;
    private Integer sat;
    private Integer toefl;
    private Double ielts;
}
