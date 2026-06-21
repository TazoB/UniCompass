package com.example.uniCompass.service;

import com.example.uniCompass.model.AppUser;
import com.example.uniCompass.model.University;
import com.example.uniCompass.dto.response.UniversityDetailResponse;
import com.example.uniCompass.dto.response.UniversityPinResponse;
import com.example.uniCompass.repository.UniversityRepository;
import com.example.uniCompass.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
public class UniversityService {
    private final UniversityRepository repository;
    private final UserRepository userRepository;

    public UniversityService(UniversityRepository repository, UserRepository userRepository) {
        this.repository = repository;
        this.userRepository = userRepository;
    }

    public List<UniversityPinResponse> findAllPins() {
        List<University> universities = repository.findAll();
        List<UniversityPinResponse> universityPinResponses = new ArrayList<>();

        universities.forEach(university -> {
            universityPinResponses.add(
                    new UniversityPinResponse(university)
            );
        });
        return universityPinResponses;
    }

    public List<UniversityDetailResponse> findAllInfo(String email) {
        List<University> universities = repository.findAll();
        List<UniversityDetailResponse> universityDetailResponses = new ArrayList<>();

        Long id = userRepository.findIdByEmail(email).orElseThrow();

        universities.forEach(university -> {
            universityDetailResponses.add(new UniversityDetailResponse(university, id));
        });

        return universityDetailResponses;
    }

    public UniversityDetailResponse findInfo(String email, Long id) {
        University uni = repository.findById(id).orElseThrow();
        Long userId = userRepository.findIdByEmail(email).orElseThrow();

        return new UniversityDetailResponse(uni, userId);
    }
}
