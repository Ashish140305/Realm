package com.realm.authservice.controller;

import com.realm.authservice.dto.ProfileDto;
import com.realm.authservice.model.User;
import com.realm.authservice.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/{userId}")
    public ResponseEntity<ProfileDto> getProfile(@PathVariable String userId) {
        Optional<User> userOptional = userRepository.findByUserId(userId);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            ProfileDto profileDto = new ProfileDto();
            profileDto.setName(user.getUserId());
            profileDto.setUsername(user.getUserId());
            profileDto.setBio(user.getBio());
            profileDto.setEmail(user.getEmail());
            profileDto.setProfession(user.getProfession());
            profileDto.setCompany(user.getCompany());
            ProfileDto.Socials socials = new ProfileDto.Socials();
            socials.setGithub(user.getGithub());
            socials.setLinkedin(user.getLinkedin());
            socials.setTwitter(user.getTwitter());
            profileDto.setSocials(socials);
            return ResponseEntity.ok(profileDto);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{userId}")
    public ResponseEntity<?> updateProfile(@PathVariable String userId, @RequestBody ProfileDto profileDto) {
        Optional<User> userOptional = userRepository.findByUserId(userId);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            user.setBio(profileDto.getBio());
            user.setEmail(profileDto.getEmail());
            user.setProfession(profileDto.getProfession());
            user.setCompany(profileDto.getCompany());
            if (profileDto.getSocials() != null) {
                user.setGithub(profileDto.getSocials().getGithub());
                user.setLinkedin(profileDto.getSocials().getLinkedin());
                user.setTwitter(profileDto.getSocials().getTwitter());
            }
            userRepository.save(user);
            return ResponseEntity.ok("Profile updated successfully");
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}