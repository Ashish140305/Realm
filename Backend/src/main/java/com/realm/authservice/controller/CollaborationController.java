package com.realm.authservice.controller;

import com.realm.authservice.dto.FollowRequest;
import com.realm.authservice.model.CollaborationSession;
import com.realm.authservice.model.Follow;
import com.realm.authservice.model.User;
import com.realm.authservice.repository.CollaborationSessionRepository;
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
    private CollaborationSessionRepository collaborationSessionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FollowRepository followRepository;

    @PostMapping("/start")
    public ResponseEntity<CollaborationSession> startSession(@RequestBody List<String> userIds) {
        CollaborationSession session = new CollaborationSession();
        session.setUserIds(userIds);
        CollaborationSession savedSession = collaborationSessionRepository.save(session);
        return ResponseEntity.ok(savedSession);
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @GetMapping("/users/{userId}")
    public ResponseEntity<List<User>> getFollowingUsers(@PathVariable String userId) {
        User user = userRepository.findByUserId(userId).orElse(null);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        List<Follow> following = followRepository.findByFollower(user);
        List<User> followingUsers = following.stream()
                .map(Follow::getFollowing)
                .collect(Collectors.toList());
        return ResponseEntity.ok(followingUsers);
    }

    @GetMapping("/users/search")
    public ResponseEntity<List<User>> searchUsers(@RequestParam String query) {
        return ResponseEntity.ok(userRepository.findByUserIdContainingIgnoreCase(query));
    }

    // New endpoint to handle following a user
    @PostMapping("/follow")
    public ResponseEntity<?> followUser(@RequestBody FollowRequest followRequest) {
        Optional<User> followerOpt = userRepository.findByUserId(followRequest.getFollowerUserId());
        Optional<User> followingOpt = userRepository.findByUserId(followRequest.getFollowingUserId());

        if (followerOpt.isEmpty() || followingOpt.isEmpty()) {
            return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
        }

        User follower = followerOpt.get();
        User following = followingOpt.get();

        if (follower.getId().equals(following.getId())) {
            return new ResponseEntity<>("You cannot follow yourself.", HttpStatus.BAD_REQUEST);
        }

        if (followRepository.existsByFollowerAndFollowing(follower, following)) {
            return new ResponseEntity<>("You are already following this user.", HttpStatus.BAD_REQUEST);
        }

        Follow follow = new Follow();
        follow.setFollower(follower);
        follow.setFollowing(following);
        followRepository.save(follow);

        return new ResponseEntity<>("Successfully followed user.", HttpStatus.OK);
    }
}