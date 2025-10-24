package com.realm.authservice.repository;

import com.realm.authservice.model.Follow;
import com.realm.authservice.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FollowRepository extends JpaRepository<Follow, Long> {

    // This method is correct and used by the controller
    Optional<Follow> findByFollowerAndFollowed(User follower, User followed);

    // This was the method with the typo. Correct "Following" to "Followed".
    boolean existsByFollowerAndFollowed(User follower, User followed);

    List<Follow> findAllByFollower(User follower);

    List<Follow> findAllByFollowed(User followed);

    long countByFollower(User follower);

    long countByFollowed(User followed);
}