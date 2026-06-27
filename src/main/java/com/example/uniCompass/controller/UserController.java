package com.example.uniCompass.controller;

import com.example.uniCompass.dto.request.*;
import com.example.uniCompass.dto.response.UserProfileResponse;
import com.example.uniCompass.service.UserProfileService;
import org.apache.coyote.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @PutMapping("/user/update-basics")
    public ResponseEntity<String> updateBasics(
            @AuthenticationPrincipal UserDetails currentUser,
            @RequestBody BasicsUpdateRequest request
    ) {
        service.updateBasics(currentUser.getUsername(), request);
        return ResponseEntity.ok("Basics updated successfully");
    }

    @PutMapping("/user/update-academics")
    public ResponseEntity<String> updateAcademics(
            @AuthenticationPrincipal UserDetails currentUser,
            @RequestBody AcademicsUpdateRequest request
    ) {
        service.updateAcademics(currentUser.getUsername(), request);
        return ResponseEntity.ok("Academics updated successfully");
    }

    @PutMapping("/user/update-preferences")
    public ResponseEntity<String> updatePreferences(
            @AuthenticationPrincipal UserDetails currentUser,
            @RequestBody PreferencesUpdateRequest request
    ) {
        service.updatePreferences(currentUser.getUsername(), request);
        return ResponseEntity.ok("Preferences updated successfully");
    }

    @PutMapping("/user/update-extracurriculars")
    public ResponseEntity<String> updateExtracurriculars(
            @AuthenticationPrincipal UserDetails currentUser,
            @RequestBody List<String> extracurriculars
    ) {
        service.updateExtracurriculars(currentUser.getUsername(), extracurriculars);
        return ResponseEntity.ok("Extracurriculars updated successfully");
    }

    @PutMapping("/user/update-skills")
    public ResponseEntity<String> updateSkills(
            @AuthenticationPrincipal UserDetails currentUser,
            @RequestBody List<String> skills
    ) {
        service.updateSkills(currentUser.getUsername(), skills);
        return ResponseEntity.ok("Skills updated successfully");
    }

    @PutMapping("/user/update-languages")
    public ResponseEntity<String> updateLanguages(
            @AuthenticationPrincipal UserDetails currentUser,
            @RequestBody List<LanguageDTO> languages
    ) {
        service.updateLanguages(currentUser.getUsername(), languages);
        return ResponseEntity.ok("Languages updated successfully");
    }

    @PutMapping("/user/update-checklist")
    public ResponseEntity<String> updateChecklist(
            @AuthenticationPrincipal UserDetails currentUser,
            @RequestBody List<ChecklistDTO> checklistItems
    ) {
        service.updateChecklist(currentUser.getUsername(), checklistItems);
        return ResponseEntity.ok("Checklist updated successfully");
    }
}
