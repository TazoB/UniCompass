package com.example.uniCompass.controller;

import com.example.uniCompass.dto.response.UniversityDetailResponse;
import com.example.uniCompass.dto.response.UniversityPinResponse;
import com.example.uniCompass.service.UniversityService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/universities")
public class UniversityController {
    private final UniversityService service;

    public UniversityController(UniversityService service) {
        this.service = service;
    }

    @GetMapping("/pins")
    public ResponseEntity<List<UniversityPinResponse>> getAllPins() {
        return ResponseEntity.ok().body(service.findAllPins());
    }

    @GetMapping("/info")
    public ResponseEntity<List<UniversityDetailResponse>> getAllInfo(@AuthenticationPrincipal UserDetails currentUser) {
        String username = currentUser.getUsername();
        return ResponseEntity.ok().body(service.findAllInfo(username));
    }

    @GetMapping("/info/{id}")
    public ResponseEntity<UniversityDetailResponse> getInfoOfParticularUniversity(
            @AuthenticationPrincipal UserDetails currentUser,
            @PathVariable Long id
    ) {
        String username = currentUser.getUsername();
        return ResponseEntity.ok(service.findInfo(username, id));
    }

    @PostMapping("/{id}/favorite")
    public ResponseEntity<String> makeUniversityUserFavorite(
            @AuthenticationPrincipal UserDetails currentUser,
            @PathVariable Long id
    ) {
        String username = currentUser.getUsername();
        service.makeUniversityUserFavorite(username, id);
        return ResponseEntity.ok("University added successfully");
    }

    @DeleteMapping("/{id}/favorite")
    public ResponseEntity<String> deleteUniversityUserFavorite(
            @AuthenticationPrincipal UserDetails currentUser,
            @PathVariable Long id
    ) {
        String username = currentUser.getUsername();
        service.deleteUniversityUserFavorite(username, id);
        return ResponseEntity.ok("University deleted successfully");
    }

    @PostMapping("/programs/{id}/favorite")
    public ResponseEntity<String> makeProgramUserFavorite(
            @AuthenticationPrincipal UserDetails currentUser,
            @PathVariable Long id
    ) {
        String username = currentUser.getUsername();
        service.makeProgramUserFavorite(username, id);
        return ResponseEntity.ok("Program added successfully");
    }

    @DeleteMapping("/programs/{id}/favorite")
    public ResponseEntity<String> deleteProgramUserFavorite(
            @AuthenticationPrincipal UserDetails currentUser,
            @PathVariable Long id
    ) {
        String username = currentUser.getUsername();
        service.deleteProgramUserFavorite(username, id);
        return ResponseEntity.ok("University deleted successfully");
    }
}
