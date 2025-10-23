package com.realm.authservice.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateProjectRequest {
    private String name;
    private String ownerUsername; // Ensure this field exists and has getters
}