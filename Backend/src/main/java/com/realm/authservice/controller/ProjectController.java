package com.realm.authservice.controller;

import com.realm.authservice.dto.CreateProjectRequest;
import com.realm.authservice.dto.ProjectDto;
import com.realm.authservice.model.Project;
import com.realm.authservice.model.User;
import com.realm.authservice.repository.ProjectRepository;
import com.realm.authservice.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {
    @Autowired
    private ProjectRepository projectRepository;
    @Autowired
    private UserRepository userRepository;

    @PostMapping("/create")
    public ResponseEntity<?> createProject(@RequestBody CreateProjectRequest request) {
        Optional<User> userOpt = userRepository.findByUsername(request.getOwnerUsername()); // Corrected: findByUsername
        if (userOpt.isEmpty()) {
            return new ResponseEntity<>("Owner not found", HttpStatus.NOT_FOUND);
        }
        Project project = new Project();
        project.setName(request.getName());
        project.setOwner(userOpt.get());
        Project savedProject = projectRepository.save(project);
        return new ResponseEntity<>(savedProject, HttpStatus.CREATED);
    }

    @GetMapping("/user/{username}")
    public ResponseEntity<List<ProjectDto>> getProjectsByUser(@PathVariable String username) {
        Optional<User> userOpt = userRepository.findByUsername(username); // Corrected: findByUsername
        if (userOpt.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        List<Project> projects = projectRepository.findByOwner(userOpt.get());
        List<ProjectDto> projectDtos = projects.stream()
                .map(project -> new ProjectDto(project.getId(), project.getName(), project.getOwner().getUsername()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(projectDtos);
    }

}