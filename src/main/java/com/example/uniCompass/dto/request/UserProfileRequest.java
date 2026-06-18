package com.example.uniCompass.dto.request;

import lombok.Data;

import java.util.List;

@Data
public class UserProfileRequest {
    private Double gpa;
    private Integer satScore;
    private Double ieltsScore;
    private Integer toeflScore;
    private Integer budget;
    private String pointOfInterest;
    private String preferredCountry;
    private String preferredCity;
    private String preferredState;
    private List<String> skills;
    private List<String> extracurriculars;
}
