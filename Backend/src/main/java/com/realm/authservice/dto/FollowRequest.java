package com.realm.authservice.dto;

import lombok.Data;

@Data
public class FollowRequest {
    private String followerUserId;
    private String followingUserId;
}