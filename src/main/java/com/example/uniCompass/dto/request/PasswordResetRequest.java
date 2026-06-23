package com.example.uniCompass.dto.request;

import lombok.Data;

@Data
public class PasswordResetRequest {
    String email;
    String newPassword;
}
