package com.example.uniCompass.dto.response;

import lombok.Data;

import java.util.List;

@Data
public class UniversityMatchResponse {
    private Long universityId;
    private List<ProgramMatch> topPrograms;
    private List<GapAnalysisDetails> gaps;

    @Data
    public static class ProgramMatch {
        private Long programId;
        private String programName;
        private Integer matchPercentage;
        private String level;

        public ProgramMatch(Long programId, String programName, Integer matchPercentage, String level) {
            this.programId = programId;
            this.programName = programName;
            this.matchPercentage = matchPercentage;
            this.level = level;
        }
    }

    @Data
    public static class GapAnalysisDetails {
        private GapType type;
        private String icon;
        private String title;
        private String text;
    }
}