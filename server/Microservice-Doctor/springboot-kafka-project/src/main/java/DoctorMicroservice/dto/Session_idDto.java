package DoctorMicroservice.dto;

import java.util.UUID;

public class Session_idDto {
    private UUID session_id;

    // Default constructor
    public Session_idDto() {
    }

    // Parameterized constructor
    public Session_idDto(UUID Session_id) {
        this.session_id = Session_id;
    }

    // Getter
    public UUID getSession_id() {
        return session_id;
    }

    // Setter
    public void setSession_id(UUID Session_id) {
        this.session_id = Session_id;
    }
}