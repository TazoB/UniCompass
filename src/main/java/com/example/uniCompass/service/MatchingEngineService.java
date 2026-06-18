package com.example.uniCompass.service;

import com.example.uniCompass.dto.request.UserProfileRequest;
import com.example.uniCompass.dto.response.UniversityMatchResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class MatchingEngineService {
    public UniversityMatchResponse calculateMatchPercentage(String email, UserProfileRequest userProfile) {
        return null;
        // TODO: algoritmia dasaweri romelic gamoitvlis procents
    }
}
