package com.example.uniCompass.service;

import com.example.uniCompass.model.AppUser;
import com.example.uniCompass.model.Program;
import com.example.uniCompass.model.University;
import com.example.uniCompass.dto.response.UniversityDetailResponse;
import com.example.uniCompass.dto.response.UniversityPinResponse;
import com.example.uniCompass.repository.ProgramRepository;
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
    private final ProgramRepository programRepository;
    private final DatabaseService databaseService;

    public UniversityService(UniversityRepository repository, UserRepository userRepository, ProgramRepository programRepository, DatabaseService databaseService) {
        this.repository = repository;
        this.userRepository = userRepository;
        this.programRepository = programRepository;
        this.databaseService = databaseService;
    }

    public List<UniversityPinResponse> findAllPins() {
        List<University> universities = repository.findAll();
        if(universities.size() < 100) {
            databaseService.executeSeedScript();
            universities = repository.findAll();
        }
        List<UniversityPinResponse> universityPinResponses = new ArrayList<>();

        universities.forEach(university -> {
            universityPinResponses.add(
                    new UniversityPinResponse(university)
            );
        });
        return universityPinResponses;
    }

    public List<UniversityDetailResponse> findAllInfo(String username) {
        List<University> universities = repository.findAll();
        List<UniversityDetailResponse> universityDetailResponses = new ArrayList<>();

        Long id = userRepository.findIdByUsername(username).orElseThrow();

        universities.forEach(university -> {
            universityDetailResponses.add(new UniversityDetailResponse(university, id));
        });

        return universityDetailResponses;
    }

    public UniversityDetailResponse findInfo(String username, Long id) {
        University uni = repository.findById(id).orElseThrow();
        Long userId = userRepository.findIdByUsername(username).orElseThrow();

        return new UniversityDetailResponse(uni, userId);
    }

    public void makeUniversityUserFavorite(String username, Long id) {
        AppUser user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        University university = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("University not found"));

        List<University> favoriteUniversities = user.getFavoriteUniversities();
        favoriteUniversities.add(university);
        user.setFavoriteUniversities(favoriteUniversities);

        userRepository.save(user);
    }

    public void makeProgramUserFavorite(String username, Long id) {
        AppUser user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        Program program = programRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Program not found"));

        List<Program> favoritePrograms = user.getFavoritePrograms();
        favoritePrograms.add(program);
        user.setFavoritePrograms(favoritePrograms);

        userRepository.save(user);
    }

    public void deleteUniversityUserFavorite(String username, Long id) {
        AppUser user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        List<University> favoriteUniversities = user.getFavoriteUniversities();

        int index = -1;

        for(int i = 0; i < favoriteUniversities.size(); i++) {
            if(Objects.equals(favoriteUniversities.get(i).getId(), id)) {
                index = i;
                break;
            }
        }
        favoriteUniversities.remove(index);
        user.setFavoriteUniversities(favoriteUniversities);

        userRepository.save(user);
    }

    public void deleteProgramUserFavorite(String username, Long id) {
        AppUser user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        List<Program> favoritePrograms = user.getFavoritePrograms();

        int index = -1;

        for(int i = 0; i < favoritePrograms.size(); i++) {
            if(Objects.equals(favoritePrograms.get(i).getId(), id)) {
                index = i;
                break;
            }
        }
        favoritePrograms.remove(index);
        user.setFavoritePrograms(favoritePrograms);

        userRepository.save(user);
    }
}
