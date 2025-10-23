package com.realm.authservice.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "projects")
@Getter
@Setter
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    // Add this relationship to link the project to a user
    @ManyToOne
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    public Project() {
    }
}