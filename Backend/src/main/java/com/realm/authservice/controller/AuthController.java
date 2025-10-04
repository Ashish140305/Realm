package com.realm.authservice.controller;

import com.realm.authservice.dto.LoginRequest;
import com.realm.authservice.dto.SignUpRequest;
import com.realm.authservice.model.User;
import com.realm.authservice.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody SignUpRequest signUpRequest) {
        if (userRepository.findByUserId(signUpRequest.getUserId()).isPresent()) {
            return new ResponseEntity<>("UserID is already taken!", HttpStatus.BAD_REQUEST);
        }

        User user = new User();
        user.setUserId(signUpRequest.getUserId());
        user.setEmail(signUpRequest.getEmail());
        user.setPassword(passwordEncoder.encode(signUpRequest.getPassword()));

        userRepository.save(user);

        return new ResponseEntity<>("User registered successfully", HttpStatus.OK);
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        Optional<User> userOptional = userRepository.findByUserId(loginRequest.getUserId());

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            if (passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
                return ResponseEntity.ok("User authenticated successfully");
            }
        }

        return new ResponseEntity<>("Invalid userId or password", HttpStatus.UNAUTHORIZED);
    }
}