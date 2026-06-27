package com.example.uniCompass.dto.response;
import com.example.uniCompass.model.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class UserProfileResponse {
    private Basics basics;
    private Preferences preferences;
    private Academics academics;
    private List<String> extracurriculars;
    private List<String> skills;
    private List<Language> languages;
    private Favorites favorites;
    private List<ChecklistItem> checklist;

    public UserProfileResponse(AppUser user, UserProfile profile) {
        this.basics = new Basics(user, profile);
        this.preferences = new Preferences(profile);
        this.academics = new Academics(profile);
        this.extracurriculars = profile.getExtracurriculars();
        this.skills = profile.getSkills();
        this.languages = getUserLanguages(user);
        this.favorites = new Favorites(user.getFavoriteUniversities(), user.getFavoritePrograms());
        this.checklist = getUserChecklist(user);
    }

    private List<Language> getUserLanguages(AppUser user) {
        List<Language> userLanguage = new ArrayList<>();
        for (UserLanguage language : user.getLanguages()) {
            userLanguage.add(new Language(
                    language.getLanguageName(),
                    language.getProficiencyLevel()
            ));
        }
        return userLanguage;
    }

    private List<ChecklistItem> getUserChecklist(AppUser user) {
        List<ChecklistItem> userChecklist = new ArrayList<>();
        for (UserChecklist userChecklistItem : user.getChecklist()) {
            userChecklist.add(new ChecklistItem(
                    userChecklistItem.getId(),
                    userChecklistItem.getTaskText(),
                    userChecklistItem.getIsCompleted()
            ));
        }
        return userChecklist;
    }

    @Data
    public static class Basics {
        private String fullName;
        private String username;
        private String email;
        private String profilePic;
        private String bio;

        public Basics(AppUser user, UserProfile profile) {
            this.fullName = profile.getFullName();
            this.username = user.getRealUsername();
            this.email = user.getEmail();
            this.profilePic = profile.getProfilePicUrl();
            this.bio = profile.getBio();
        }
    }

    @Data
    public static class Preferences {
        private String country;
        private String city;
        private String state;
        private Integer budget;
        private String poi;

        public Preferences(UserProfile profile) {
            this.country = profile.getPreferredCountry();
            this.city = profile.getPreferredCity();
            this.state = profile.getPreferredState();
            this.budget = profile.getBudget();
            this.poi = profile.getPointOfInterest();
        }
    }

    @Data
    public static class Academics {
        private Double gpa;
        private Integer sat;
        private Integer toefl;
        private Double ielts;

        public Academics(UserProfile profile) {
            this.gpa = profile.getGpa();
            this.sat = profile.getSatScore();
            this.toefl = profile.getToeflScore();
            this.ielts = profile.getIeltsScore();
        }
    }

    @Data
    public static class Language {
        private String language;
        private String level;

        public Language(String language, String level) {
            this.language = language;
            this.level = level;
        }
    }

    @Data
    public static class Favorites {
        private List<String> universities;
        private List<String> programs;

        public Favorites(List<University> universities, List<Program> programs) {
            List<String> universityNames = new ArrayList<>();
            List<String> programNames = new ArrayList<>();

            for (University university : universities) {
                universityNames.add(university.getName());
            }

            for (Program program : programs) {
                University university = program.getUniversity();
                String programTitle = program.getName() + " from " + university.getName();
                programNames.add(programTitle);
            }

            this.universities = universityNames;
            this.programs = programNames;
        }
    }

    @Data
    public static class ChecklistItem {
        private Long id;
        private String text;
        private Boolean completed;

        public ChecklistItem(Long id, String text, Boolean completed) {
            this.id = id;
            this.text = text;
            this.completed = completed;
        }
    }
}