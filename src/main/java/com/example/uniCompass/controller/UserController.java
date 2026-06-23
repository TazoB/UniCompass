package com.example.uniCompass.controller;

import com.example.uniCompass.dto.response.UserProfileResponse;
import com.example.uniCompass.service.UserProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class UserController {
    private final UserProfileService service;

    public UserController(UserProfileService service) {
        this.service = service;
    }

    @GetMapping("/user")
    public ResponseEntity<UserProfileResponse> findUser(@AuthenticationPrincipal UserDetails currentUser) {
        return ResponseEntity.ok(service.findUser(currentUser.getUsername()));
    }

    @PostMapping("/user/update-basics")
    public ResponseEntity<String> updateBasics(
            @AuthenticationPrincipal UserDetails currentUser,
            @RequestBody BasicsUpdateRequest request
    ) {
        service.updateBasics(currentUser.getUsername(), request);
        return ResponseEntity.ok("Basics updated successfully");
    }

    @PostMapping("/user/update-academics")
    public ResponseEntity<String> updateAcademics(
            @AuthenticationPrincipal UserDetails currentUser,
            @RequestBody AcademicsUpdateRequest request
    ) {
        service.updateAcademics(currentUser.getUsername(), request);
        return ResponseEntity.ok("Academics updated successfully");
    }

    @PostMapping("/user/update-preferences")
    public ResponseEntity<String> updatePreferences(
            @AuthenticationPrincipal UserDetails currentUser,
            @RequestBody PreferencesUpdateRequest request
    ) {
        service.updatePreferences(currentUser.getUsername(), request);
        return ResponseEntity.ok("Preferences updated successfully");
    }
}
