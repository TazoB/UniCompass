package com.example.uniCompass.controller;

import com.example.uniCompass.service.EmailService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Random;

@RestController
@RequestMapping("/mail")
public class EmailController {
    private final EmailService service;

    public EmailController(EmailService service) {
        this.service = service;
    }

    @PostMapping("/otp")
    public ResponseEntity<String> sendOTP(@RequestBody Map<String, String> email) {
        Random random = new Random();
        String generatedOTP = String.valueOf(random.nextInt(900000) + 100000);

        service.sendVerificationCode(email.get("recipientEmail"), generatedOTP);
        return ResponseEntity.ok().body(generatedOTP);
    }
}
