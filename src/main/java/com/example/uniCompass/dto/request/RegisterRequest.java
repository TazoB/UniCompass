package com.example.uniCompass.dto.request;

import lombok.Data;

@Data
public class RegisterRequest {
    String email;
    String username;
    String password;
}
