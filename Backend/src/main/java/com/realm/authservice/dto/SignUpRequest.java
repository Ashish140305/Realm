package com.realm.authservice.dto;

import lombok.Data;

@Data
public class SignUpRequest {
    private String userId;
    private String email;
    private String password;
}