package com.example.uniCompass.dto.request;

import lombok.Data;

import java.util.List;

@Data
public class FullRegistrationRequest {
    private Basics basics;
    private Preferences preferences;
    private Academics academics;
    private List<String> languages;
    private List<String> skills;
    private List<String> extracurriculars;

    @Data
    public static class Basics {
        private String fullName;
        private String username;
        private String email;
        private String password;
    }

    @Data
    public static class Preferences {
        private String country;
        private String city;
        private String state;
        private Integer budget;
        private String poi;
    }

    @Data
    public static class Academics {
        private Double gpa;
        private Integer sat;
        private Integer toefl;
        private Double ielts;
    }

}
