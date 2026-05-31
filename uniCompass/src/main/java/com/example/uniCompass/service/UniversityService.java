package com.example.uniCompass.service;

import com.example.uniCompass.model.University;
import com.example.uniCompass.model.UniversityDTO;
import com.example.uniCompass.repository.UniversityRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class UniversityService {
    private final UniversityRepository repository;

    public UniversityService(UniversityRepository repository) {
        this.repository = repository;
    }

    public List<UniversityDTO> findAll() {
        List<University> universities =  repository.findAll();
        List<UniversityDTO> universityDTOS = new ArrayList<>();

        for (University university : universities) {
            UniversityDTO universityDTO = new UniversityDTO(
                    university.getName(),
                    university.getLocation(),
                    university.getLatitude(),
                    university.getLongitude()
            );
            universityDTOS.add(universityDTO);
        }
        return universityDTOS;
    }
}
