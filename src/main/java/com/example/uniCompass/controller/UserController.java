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
}
