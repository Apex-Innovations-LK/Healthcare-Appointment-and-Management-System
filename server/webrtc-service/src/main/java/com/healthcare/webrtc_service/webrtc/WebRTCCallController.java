package com.healthcare.webrtc_service.webrtc;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;

@RestController
@RequestMapping("/api/webrtc/calls")
public class WebRTCCallController {
     @Autowired
    private WebRTCCallRepository repo;

    @PostMapping("/start")
    public WebRTCCallSession startCall(@RequestBody WebRTCCallSession request) {
        request.setStartedAt(LocalDateTime.now());
        return repo.save(request);
    }

    @PostMapping("/end/{id}")
    public WebRTCCallSession endCall(@PathVariable Long id) {
        WebRTCCallSession session = repo.findById(id)
            .orElseThrow(() -> new RuntimeException("Not found"));
        session.setEndedAt(LocalDateTime.now());
        return repo.save(session);
    }

    @GetMapping
    public List<WebRTCCallSession> getAllCalls() {
        return repo.findAll();
    }
}