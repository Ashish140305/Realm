package com.realm.authservice.dto;

import lombok.Data;

@Data
public class ProfileDto {
    private String name;
    private String username;
    private String bio;
    private String email;
    private String profession;
    private String company;
    private Socials socials;

    @Data
    public static class Socials {
        private String github;
        private String linkedin;
        private String twitter;
    }
}