package com.realm.authservice.repository;

import com.realm.authservice.model.CollaborationSession;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CollaborationSessionRepository extends JpaRepository<CollaborationSession, String> {
}