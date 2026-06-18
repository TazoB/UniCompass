package com.example.uniCompass.controller;

import com.example.uniCompass.dto.response.UniversityDetailResponse;
import com.example.uniCompass.dto.response.UniversityPinResponse;
import com.example.uniCompass.service.UniversityService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/universities")
public class UniversityController {
    private final UniversityService service;

    public UniversityController(UniversityService service) {
        this.service = service;
    }

    @GetMapping("/pins")
    public ResponseEntity<List<UniversityPinResponse>> findAllPins() {
        return ResponseEntity.ok().body(service.findAllPins());
    }

    @GetMapping("/info")
    public ResponseEntity<List<UniversityDetailResponse>> findAllInfo(@AuthenticationPrincipal UserDetails currentUser) {
        String email = currentUser.getUsername();
        return ResponseEntity.ok().body(service.findAllInfo(email));
    }
}
