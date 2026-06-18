package com.example.uniCompass.service;

import com.example.uniCompass.dto.response.AuthResponse;
import com.example.uniCompass.dto.request.LoginRequest;
import com.example.uniCompass.dto.request.RegisterRequest;
import com.example.uniCompass.model.AppUser;
import com.example.uniCompass.repository.UserRepository;
import com.example.uniCompass.util.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;

    public void register(RegisterRequest userDto) {
        if (userRepository.findByEmail(userDto.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already exists");
        }

        AppUser newUser = new AppUser();
        newUser.setUsername(userDto.getUsername());
        newUser.setEmail(userDto.getEmail());
        newUser.setPasswordHash(passwordEncoder.encode(userDto.getPassword()));

        userRepository.save(newUser);
    }

    public AuthResponse login(LoginRequest userDto) {
        try {
            Authentication auth = new UsernamePasswordAuthenticationToken(
                    userDto.getEmail(),
                    userDto.getPassword()
            );
            Authentication authentication = authenticationManager.authenticate(auth);

            UserDetails userDetails = (UserDetails) authentication.getPrincipal();

            String token = JwtUtils.generateToken(userDetails);

            return new AuthResponse(token);

        } catch (BadCredentialsException e) {
            System.err.println("AuthManagerFailed: Invalid credentials");
            throw new IllegalArgumentException("User/password invalid");
        }
    }
}