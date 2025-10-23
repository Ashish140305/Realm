package com.realm.authservice.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProfileDto {
    private String username;
    private String name;
    private String email;
    private String avatar; // <-- Add this line
}