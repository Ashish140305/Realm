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

    @PostMapping
    public ResponseEntity<?> createProject(@RequestBody CreateProjectRequest createProjectRequest) {
        Optional<User> userOptional = userRepository.findByUserId(createProjectRequest.getUserId());
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            Project project = new Project();
            project.setName(createProjectRequest.getName());
            project.setDescription(createProjectRequest.getDescription());
            project.setLanguage(createProjectRequest.getLanguage());
            project.setUser(user);
            projectRepository.save(project);
            return new ResponseEntity<>("Project created successfully", HttpStatus.CREATED);
        } else {
            return new ResponseEntity<>("User not found", HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<ProjectDto>> getProjects(@PathVariable String userId) {
        Optional<User> userOptional = userRepository.findByUserId(userId);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            List<Project> projects = projectRepository.findByUser(user);
            List<ProjectDto> projectDtos = projects.stream().map(project -> {
                ProjectDto dto = new ProjectDto();
                dto.setName(project.getName());
                dto.setDescription(project.getDescription());
                dto.setLanguage(project.getLanguage());
                return dto;
            }).collect(Collectors.toList());
            return ResponseEntity.ok(projectDtos);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}