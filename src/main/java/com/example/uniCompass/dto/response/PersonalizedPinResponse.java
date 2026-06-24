package com.example.uniCompass.dto.response;

import com.example.uniCompass.model.University;
import lombok.Data;

@Data
public class PersonalizedPinResponse {
    private Long universityId;
    private Double latitude;
    private Double longitude;
    private Integer bestMatchPercentage;
    private String matchLevel;

    public PersonalizedPinResponse(
            University university, Integer bestMatchPercentage, String matchLevel
    ) {
        this.universityId = university.getId();
        this.latitude = university.getLatitude();
        this.longitude = university.getLongitude();
        this.bestMatchPercentage = bestMatchPercentage;
        this.matchLevel = matchLevel;
    }
}
