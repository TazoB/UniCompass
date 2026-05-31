package com.example.uniCompass.controller;

import com.example.uniCompass.model.User;
import com.example.uniCompass.model.UserDTO;
import com.example.uniCompass.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "http://127.0.0.1:5500")
@RestController
@RequestMapping("/register")
public class UserController {
    private final UserService service;

    public UserController(UserService service) {
        this.service = service;
    }

    @PostMapping("/getUser")
    public ResponseEntity<String> getUser(@RequestBody LogInRequest request) {
        boolean userExistsInDb = service.userExists(request.getEmail());

        if (!userExistsInDb) {
            return ResponseEntity.ok("User not found");
        }

        return ResponseEntity.ok("User found successfully");
    }

    @PostMapping("/signUp")
    public ResponseEntity<Map<String, String>> signUp(@RequestBody UserDTO user) {
        UserDTO user1 = service.save(user);
        Map<String, String> response = new HashMap<>();

        if(user1 != null) {
            response.put("message", "Successful sign up");
            return ResponseEntity.ok().body(response);
        }

        response.put("error", "User with this email already exists");
        return ResponseEntity.badRequest().body(response);
    }

    @GetMapping("/getUser")
    public ResponseEntity<String> getUserByEmail(@RequestBody String email) {
        return ResponseEntity.ok().body(service.findByEmail(email) == null ? "User not found" : "User found");
    }
}
