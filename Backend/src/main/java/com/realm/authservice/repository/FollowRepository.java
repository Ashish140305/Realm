package com.realm.authservice.repository;

import com.realm.authservice.model.Follow;
import com.realm.authservice.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FollowRepository extends JpaRepository<Follow, Long> {
    List<Follow> findByFollower(User follower);

    boolean existsByFollowerAndFollowing(User follower, User following);
}