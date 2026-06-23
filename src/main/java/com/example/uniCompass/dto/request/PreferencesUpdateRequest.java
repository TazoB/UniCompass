package com.example.uniCompass.dto.request;

import lombok.Data;

@Data
public class PreferencesUpdateRequest {
    private String country;
    private String city;
    private String state;
    private Integer budget;
    private String poi;
}
