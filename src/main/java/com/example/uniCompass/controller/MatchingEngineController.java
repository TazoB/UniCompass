package com.example.uniCompass.controller;

import com.example.uniCompass.dto.request.UserProfileRequest;
import com.example.uniCompass.dto.response.UniversityMatchResponse;
import com.example.uniCompass.service.MatchingEngineService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/match")
public class MatchingEngineController {
    private final MatchingEngineService service;

    public MatchingEngineController(MatchingEngineService service) {
        this.service = service;
    }

    @PostMapping("/calculate")
    public ResponseEntity<UniversityMatchResponse> calculate(
            @AuthenticationPrincipal UserDetails currentUser,
            @RequestBody UserProfileRequest userProfile
            ) {
        return ResponseEntity.ok(service.calculateMatchPercentage(currentUser.getUsername(), userProfile));
    }
}
