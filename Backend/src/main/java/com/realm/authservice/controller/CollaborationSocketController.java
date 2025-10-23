package com.realm.authservice.controller;

import com.realm.authservice.dto.socket.CodeChangeDTO;
import com.realm.authservice.dto.socket.CursorChangeDTO;
import com.realm.authservice.dto.socket.UserPresenceDTO;
import com.realm.authservice.service.CollaborationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import java.util.Map; // <--- ADD THIS LINE
import java.util.Set;

@Controller
public class CollaborationSocketController {

    @Autowired
    private CollaborationService collaborationService;

    @MessageMapping("/session/{sessionId}/code")
    @SendTo("/topic/session/{sessionId}/code")
    public CodeChangeDTO handleCodeChange(@DestinationVariable String sessionId, CodeChangeDTO payload) {
        return payload;
    }

    @MessageMapping("/session/{sessionId}/cursor")
    @SendTo("/topic/session/{sessionId}/cursor")
    public CursorChangeDTO handleCursorChange(@DestinationVariable String sessionId, CursorChangeDTO payload) {
        return payload;
    }

    @MessageMapping("/session/{sessionId}/join")
    @SendTo("/topic/session/{sessionId}/presence")
    public UserPresenceDTO userJoined(@DestinationVariable String sessionId, Map<String, String> payload) {
        String username = payload.get("username");
        collaborationService.addUserToSession(sessionId, username);
        Set<String> users = collaborationService.getUsersInSession(sessionId);

        UserPresenceDTO presenceDTO = new UserPresenceDTO();
        presenceDTO.setUsers(users);
        presenceDTO.setUsername(username);
        presenceDTO.setEvent("join");
        return presenceDTO;
    }

    @MessageMapping("/session/{sessionId}/leave")
    @SendTo("/topic/session/{sessionId}/presence")
    public UserPresenceDTO userLeft(@DestinationVariable String sessionId, Map<String, String> payload) {
        String username = payload.get("username");
        collaborationService.removeUserFromSession(sessionId, username);
        Set<String> users = collaborationService.getUsersInSession(sessionId);

        UserPresenceDTO presenceDTO = new UserPresenceDTO();
        presenceDTO.setUsers(users);
        presenceDTO.setUsername(username);
        presenceDTO.setEvent("leave");
        return presenceDTO;
    }
}