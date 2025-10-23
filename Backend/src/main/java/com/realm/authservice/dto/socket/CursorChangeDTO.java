package com.realm.authservice.dto.socket;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CursorChangeDTO {
    private String userId;
    private String userName;
    private String color;
    private int line;
    private int column;
    private boolean isTyping;
    private String sender;
}