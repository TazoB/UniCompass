package com.example.uniCompass.service;

import com.example.uniCompass.repository.FacultyRepository;
import org.springframework.stereotype.Service;

@Service
public class FacultyService {
    private final FacultyRepository repository;

    public FacultyService(FacultyRepository repository) {
        this.repository = repository;
    }


}
