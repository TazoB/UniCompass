package com.example.uniCompass.dto.response;

import com.example.uniCompass.model.AppUser;
import com.example.uniCompass.model.University;
import lombok.*;

import java.util.List;
import java.util.Objects;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class UniversityDetailResponse {
    private Long id;
    private String name;
    private String country;
    private String city;
    private String description;
    private Integer worldRanking;
    private String coverImageUrl;
    private String websiteUrl;
    private Boolean isUserFavorite;

    public UniversityDetailResponse (University university, Long userId) {
        List<AppUser> users = university.getFavoriteByUsers();

        for (AppUser user : users) {
            if(Objects.equals(user.getId(), userId)) {
                this.isUserFavorite = true;
                break;
            }
        }

        this.id = university.getId();
        this.name = university.getName();
        this.country = university.getCountry();
        this.city = university.getCity();
        this.description = university.getDescription();
        this.worldRanking = university.getWorldRanking();
        this.coverImageUrl = university.getCoverImageUrl();
        this.websiteUrl = university.getWebsiteUrl();
    }
}
