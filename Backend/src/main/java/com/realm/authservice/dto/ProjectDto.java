package com.realm.authservice.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor // This annotation creates the empty constructor
@AllArgsConstructor // This annotation creates the constructor with all fields
public class ProjectDto {
    private Long id;
    private String name;
    private String ownerUsername;
}