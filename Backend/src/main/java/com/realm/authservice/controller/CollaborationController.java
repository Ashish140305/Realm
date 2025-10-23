package com.realm.authservice.controller;

import com.realm.authservice.dto.FollowRequest;
import com.realm.authservice.dto.ProfileDto;
import com.realm.authservice.model.Follow;
import com.realm.authservice.model.User;
import com.realm.authservice.repository.FollowRepository;
import com.realm.authservice.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/collaboration")
public class CollaborationController {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FollowRepository followRepository;

    @PostMapping("/follow")
    public ResponseEntity<String> followUser(@RequestBody FollowRequest followRequest) {

        Optional<User> followerOpt = userRepository.findByUsername(followRequest.getFollowerUsername());
        Optional<User> followedOpt = userRepository.findByUsername(followRequest.getFollowedUsername());

        if (followerOpt.isPresent() && followedOpt.isPresent()) {
            User follower = followerOpt.get();
            User followed = followedOpt.get();

            if (followRepository.findByFollowerAndFollowed(follower, followed).isPresent()) {
                return new ResponseEntity<>("Already following this user.", HttpStatus.BAD_REQUEST);
            }

            Follow follow = new Follow();
            follow.setFollower(follower);
            follow.setFollowed(followed);
            followRepository.save(follow);

            return new ResponseEntity<>("Successfully followed user.", HttpStatus.OK);
        }
        return new ResponseEntity<>("User not found.", HttpStatus.NOT_FOUND);
    }

    @GetMapping("/search")
    public ResponseEntity<List<ProfileDto>> searchUsers(@RequestParam String query) {
        List<User> users = userRepository.findByUsernameContainingIgnoreCase(query);
        List<ProfileDto> profiles = users.stream().map(user -> {
            ProfileDto dto = new ProfileDto();
            dto.setUsername(user.getUsername());
            dto.setName(user.getName());
            dto.setEmail(user.getEmail());
            return dto;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(profiles);
    }
}