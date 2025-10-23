package com.realm.authservice.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import lombok.Data;
import java.util.Set;

@Data
@Entity
public class ChatRoom {
    @Id
    private String id;

    @ManyToMany
    private Set<User> users;
}