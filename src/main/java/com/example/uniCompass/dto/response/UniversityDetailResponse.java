package com.example.uniCompass.dto.response;

import lombok.*;

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
}
