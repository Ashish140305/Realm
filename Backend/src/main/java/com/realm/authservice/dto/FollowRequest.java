package com.realm.authservice.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FollowRequest {
    private String followerUsername;
    private String followedUsername;
}