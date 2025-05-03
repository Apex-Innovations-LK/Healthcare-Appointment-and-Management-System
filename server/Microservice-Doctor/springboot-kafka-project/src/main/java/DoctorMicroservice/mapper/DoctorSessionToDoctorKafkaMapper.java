
package DoctorMicroservice.mapper;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.UUID;

import DoctorMicroservice.dto.DoctorSessionDto;
import DoctorMicroservice.kafka.DoctorKafkaEvent;

public class DoctorSessionToDoctorKafkaMapper {

    // Converts DoctorSessionDto -> DoctorKafkaEvent
    public static DoctorKafkaEvent toKafkaEvent(DoctorSessionDto dto) {
        DoctorKafkaEvent event = new DoctorKafkaEvent();

        event.setDoctor_id(UUID.nameUUIDFromBytes(dto.getDoctorId().toString().getBytes()));
        event.setSession_id(UUID.nameUUIDFromBytes(dto.getDoctorSessionId().toString().getBytes()));
        event.setFrom(convertToDate(dto.getStartTime()));
        event.setTo(convertToDate(dto.getEndTime()));
        event.setNumber_of_patients(dto.getCount());

        return event;
    }

    // Converts DoctorKafkaEvent -> DoctorSessionDto
    public static DoctorSessionDto toDoctorSessionDto(DoctorKafkaEvent event) {
        DoctorSessionDto dto = new DoctorSessionDto();

        dto.setDoctorId(getLongFromUUID(event.getDoctor_id()));
        dto.setDoctorSessionId(getLongFromUUID(event.getSession_id()));
        dto.setStartTime(convertToLocalDateTime(event.getFrom()));
        dto.setEndTime(convertToLocalDateTime(event.getTo()));
        dto.setCount(event.getNumber_of_patients());

        return dto;
    }

    // Helper method to convert LocalDateTime -> Date
    private static Date convertToDate(LocalDateTime localDateTime) {
        return Date.from(localDateTime.atZone(ZoneId.systemDefault()).toInstant());
    }

    // Helper method to convert Date -> LocalDateTime
    private static LocalDateTime convertToLocalDateTime(Date date) {
        return Instant.ofEpochMilli(date.getTime()).atZone(ZoneId.systemDefault()).toLocalDateTime();
    }

    // Convert UUID (from name) back to Long (risky: demo only)
    private static Long getLongFromUUID(UUID uuid) {
        // This method assumes UUID was created from Long via nameUUIDFromBytes
        // There is no direct way to get back the original Long reliably
        // In production, better to pass real UUIDs as part of both microservices
        return Math.abs(uuid.getMostSignificantBits());
    }
}
