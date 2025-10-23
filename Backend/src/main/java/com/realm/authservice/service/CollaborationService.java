package com.realm.authservice.service;

import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class CollaborationService {

    private final Map<String, Set<String>> sessionUsers = new ConcurrentHashMap<>();

    public void addUserToSession(String sessionId, String username) {
        sessionUsers.computeIfAbsent(sessionId, k -> ConcurrentHashMap.newKeySet()).add(username);
    }

    public void removeUserFromSession(String sessionId, String username) {
        if (sessionUsers.containsKey(sessionId)) {
            sessionUsers.get(sessionId).remove(username);
            if (sessionUsers.get(sessionId).isEmpty()) {
                sessionUsers.remove(sessionId);
            }
        }
    }

    public Set<String> getUsersInSession(String sessionId) {
        return sessionUsers.get(sessionId);
    }
}