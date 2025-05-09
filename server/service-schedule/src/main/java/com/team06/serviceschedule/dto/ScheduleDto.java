//package com.team06.serviceschedule.dto;
//
//import java.util.Date;
//import java.util.UUID;
//
//public class ScheduleDto {
//
//    private UUID doctor_id;
//    private Date from;
//    private Date to;
//
//    public ScheduleDto() {}
//
//    public ScheduleDto(UUID doctor_id, Date from, Date to) {
//        this.doctor_id = doctor_id;
//        this.from = from;
//        this.to = to;
//    }
//
//    public UUID getDoctor_id() {
//        return doctor_id;
//    }
//
//    public void setDoctor_id(UUID doctor_id) {
//        this.doctor_id = doctor_id;
//    }
//
//    public Date getFrom() {
//        return from;
//    }
//
//    public void setFrom(Date from) {
//        this.from = from;
//    }
//
//    public Date getTo() {
//        return to;
//    }
//
//    public void setTo(Date to) {
//        this.to = to;
//    }
//}
package com.team06.serviceschedule.dto;

import java.util.Date;
import java.util.UUID;

// For Spring Data JPA projection with native queries
public interface ScheduleDto {
    UUID getDoctor_id();
    Date getFrom();
    Date getTo();
}