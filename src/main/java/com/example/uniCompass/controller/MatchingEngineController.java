package com.example.uniCompass.controller;

import com.example.uniCompass.dto.response.PersonalizedPinResponse;
import com.example.uniCompass.dto.response.UniversityMatchResponse;
import com.example.uniCompass.dto.response.UniversityMatchesForPins;
import com.example.uniCompass.service.MatchingEngineService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/universities")
public class MatchingEngineController {
    private final MatchingEngineService service;

    public MatchingEngineController(MatchingEngineService service) {
        this.service = service;
    }

    @PostMapping("/calculate/{id}")
    public ResponseEntity<UniversityMatchResponse> calculate(
            @AuthenticationPrincipal UserDetails currentUser,
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(service.universityMatch(currentUser.getUsername(), id));
    }

    @GetMapping("/map-matches")
    public ResponseEntity<List<PersonalizedPinResponse>> pinMatches(
            @AuthenticationPrincipal UserDetails currentUser
    ) {
        return ResponseEntity.ok(service.matchPins(currentUser.getUsername()));
    }

}
