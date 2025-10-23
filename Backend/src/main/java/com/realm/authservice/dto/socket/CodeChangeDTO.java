package com.realm.authservice.dto.socket;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CodeChangeDTO {
    private String fileId;
    private String content;
    private String sender;
}