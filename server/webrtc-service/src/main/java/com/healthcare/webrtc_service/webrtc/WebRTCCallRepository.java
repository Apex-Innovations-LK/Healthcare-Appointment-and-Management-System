package com.healthcare.webrtc_service.webrtc;

import org.springframework.data.jpa.repository.JpaRepository;

public interface WebRTCCallRepository extends JpaRepository<WebRTCCallSession, Long> {

}
