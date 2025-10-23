package com.realm.authservice.dto.socket;

import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
public class UserPresenceDTO {
    private Set<String> users;
    private String event; // e.g., "join" or "leave"
    private String username;
}