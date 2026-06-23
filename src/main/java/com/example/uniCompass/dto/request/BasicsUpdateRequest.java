package com.example.uniCompass.dto.request;

import lombok.Data;

@Data
public class BasicsUpdateRequest {
    String fullName;
    String username;
    String email;
    String bio;
    String profilePicUrl;
}
