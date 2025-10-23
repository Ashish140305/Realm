package com.realm.authservice.repository;

import com.realm.authservice.model.Project;
import com.realm.authservice.model.User; // <-- Import User
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List; // <-- Import List

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {

    // Add this method to find projects by the owner
    List<Project> findByOwner(User owner);
}