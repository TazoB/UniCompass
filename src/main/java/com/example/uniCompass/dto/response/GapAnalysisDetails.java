package com.example.uniCompass.dto.response;

import lombok.Data;

@Data
public class GapAnalysisDetails {
    private String type; // "LANGUAGE", "ACADEMIC", "EXTRACURRICULAR"
    private String icon; // frontend
    private String title;
    private String text;
}
