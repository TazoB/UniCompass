package com.example.uniCompass.dto.response;

import com.example.uniCompass.model.University;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class UniversityPinResponse {
    private Long id;
    private double latitude;
    private double longitude;

    public UniversityPinResponse(University university) {
        this.id = university.getId();
        this.latitude = university.getLatitude();
        this.longitude = university.getLongitude();
    }
}
