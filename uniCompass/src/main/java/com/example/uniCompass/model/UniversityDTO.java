package com.example.uniCompass.model;

import lombok.*;

@AllArgsConstructor
@RequiredArgsConstructor
@Getter
@Setter
@ToString
public class UniversityDTO {
    private String name;
    private String location;
    private Double latitude;
    private Double longitude;
}
