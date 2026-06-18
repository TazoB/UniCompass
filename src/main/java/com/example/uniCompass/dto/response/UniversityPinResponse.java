package com.example.uniCompass.dto.response;

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
}
