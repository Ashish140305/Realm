package com.realm.authservice.repository;

import com.realm.authservice.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUserId(String userId);

    // Add this method to search for users
    List<User> findByUserIdContainingIgnoreCase(String userId);
}