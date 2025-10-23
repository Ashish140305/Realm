package com.realm.authservice.controller;

import com.realm.authservice.dto.ProfileDto;
import com.realm.authservice.model.User;
import com.realm.authservice.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/{username}")
    public ResponseEntity<ProfileDto> getProfile(@PathVariable String username) {
        return userRepository.findByUsername(username)
                .map(user -> {
                    ProfileDto profileDto = new ProfileDto();
                    profileDto.setUsername(user.getUsername());
                    profileDto.setName(user.getName());
                    profileDto.setEmail(user.getEmail());
                    return ResponseEntity.ok(profileDto);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // New method to get all users
    @GetMapping("/users")
    public ResponseEntity<List<ProfileDto>> getAllUsers() {
        List<ProfileDto> users = userRepository.findAll().stream()
                .map(user -> {
                    ProfileDto profileDto = new ProfileDto();
                    profileDto.setUsername(user.getUsername());
                    profileDto.setName(user.getName());
                    profileDto.setEmail(user.getEmail());
                    // Add a default avatar for simplicity
                    profileDto.setAvatar("https://api.dicebear.com/7.x/avataaars/svg?seed=" + user.getUsername());
                    return profileDto;
                })
                .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }
}