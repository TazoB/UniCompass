package com.example.uniCompass.dto.response;

import com.example.uniCompass.model.AppUser;
import com.example.uniCompass.model.University;
import lombok.Data;

import java.util.List;
import java.util.Objects;

@Data
public class UniversityMatchResponse {
    private Long universityId;
    private String name;
    private String country;
    private String city;
    private String description;
    private Integer worldRanking;
    private String coverImageUrl;
    private String websiteUrl;
    private Boolean isUserFavorite;
    private List<ProgramMatch> topPrograms;
    private List<GapAnalysisDetails> gaps;

    public UniversityMatchResponse(University university, Long userId, List<ProgramMatch> topPrograms, List<GapAnalysisDetails> gaps) {
        this.universityId = university.getId();
        this.name = university.getName();
        this.country = university.getCountry();
        this.city = university.getCity();
        this.description = university.getDescription();
        this.worldRanking = university.getWorldRanking();
        this.coverImageUrl = university.getCoverImageUrl();
        this.websiteUrl = university.getWebsiteUrl();
        this.topPrograms = topPrograms;
        this.gaps = gaps;

        this.isUserFavorite = false;
        List<AppUser> users = university.getFavoriteByUsers();
        if (users != null) {
            for (AppUser user : users) {
                if(Objects.equals(user.getId(), userId)) {
                    this.isUserFavorite = true;
                    break;
                }
            }
        }
    }

    @Data
    public static class ProgramMatch {
        private Long programId;
        private String programName;
        private Integer matchPercentage;
        private String level;
        private boolean isUserFavorite;

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

        public GapAnalysisDetails(GapType type, String icon, String title, String text) {
            this.type = type;
            this.icon = icon;
            this.title = title;
            this.text = text;
        }
    }
}