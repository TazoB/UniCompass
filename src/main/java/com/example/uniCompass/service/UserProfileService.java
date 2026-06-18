package com.example.uniCompass.service;

import com.example.uniCompass.repository.UserProfileRepository;
import org.springframework.stereotype.Service;

@Service
public class UserProfileService {
    private final UserProfileRepository repository;

    public UserProfileService(UserProfileRepository repository) {
        this.repository = repository;
    }
}
