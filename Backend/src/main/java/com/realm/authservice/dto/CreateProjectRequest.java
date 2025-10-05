package com.realm.authservice.dto;

import lombok.Data;

@Data
public class CreateProjectRequest {
    private String name;
    private String description;
    private String language;
    private String userId;
}