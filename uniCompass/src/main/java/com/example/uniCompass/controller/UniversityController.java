package com.example.uniCompass.controller;

import com.example.uniCompass.model.UniversityDTO;
import com.example.uniCompass.service.UniversityService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin(origins = "http://127.0.0.1:5500")
@RestController
@RequestMapping("/universities")
public class UniversityController {
    private final UniversityService service;

    public UniversityController(UniversityService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<UniversityDTO>> findAll() {
        return ResponseEntity.ok().body(service.findAll());
    }
}
