package com.example.uniCompass.dto.response;

import lombok.Data;

import java.util.List;

@Data
public class UniversityMatchResponse {
    private Long universityId;
    private Long bestProgramId;
    private String programName;
    private Integer matchPercentage;
    private List<GapAnalysisDetails> gaps;
}
