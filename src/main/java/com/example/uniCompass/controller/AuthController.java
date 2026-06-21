package com.example.uniCompass.controller;

import com.example.uniCompass.dto.request.FullRegistrationRequest;
import com.example.uniCompass.dto.response.AuthResponse;
import com.example.uniCompass.dto.request.LoginRequest;
import com.example.uniCompass.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody FullRegistrationRequest userDto) {
        authService.register(userDto);
        return ResponseEntity.status(HttpStatus.CREATED).body("User registered successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest userDto) {
        AuthResponse response = authService.login(userDto);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/check-availability")
    public ResponseEntity<Map<String, Boolean>> checkAvailability(
            @RequestParam String email,
            @RequestParam String username) {

        boolean emailTaken = authService.existsByEmail(email);
        boolean usernameTaken = authService.existsByUsername(username);

        Map<String, Boolean> response = new HashMap<>();
        response.put("emailTaken", emailTaken);
        response.put("usernameTaken", usernameTaken);

        return ResponseEntity.ok(response);
    }
}