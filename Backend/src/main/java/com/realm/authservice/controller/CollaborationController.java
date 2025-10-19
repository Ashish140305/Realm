package com.realm.authservice.controller;

import com.realm.authservice.model.CollaborationSession;
import com.realm.authservice.repository.CollaborationSessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/collaboration")
public class CollaborationController {

    @Autowired
    private CollaborationSessionRepository collaborationSessionRepository;

    /**
     * Creates a new collaboration session and returns its unique ID.
     * The frontend will use this ID to create a real-time channel in Supabase.
     * 
     * @param userIds The list of users invited to the session.
     * @return The newly created CollaborationSession object with its generated ID.
     */
    @PostMapping("/start")
    public ResponseEntity<CollaborationSession> startSession(@RequestBody List<String> userIds) {
        CollaborationSession session = new CollaborationSession();
        session.setUserIds(userIds);
        CollaborationSession savedSession = collaborationSessionRepository.save(session);
        return ResponseEntity.ok(savedSession);
    }
}