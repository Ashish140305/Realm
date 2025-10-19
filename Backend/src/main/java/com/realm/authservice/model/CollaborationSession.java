package com.realm.authservice.model;

import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
@Entity
public class CollaborationSession {

    @Id
    private String id = UUID.randomUUID().toString();

    @ElementCollection
    private List<String> userIds;
}