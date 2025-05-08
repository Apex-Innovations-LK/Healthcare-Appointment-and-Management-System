//package com.team06.serviceschedule.dto;
//
//import java.util.Date;
//import java.util.UUID;
//
//public class DoctorKafkaEvent {
//
//    private UUID doctor_id;
//    private UUID session_id;
//    private Date from;
//    private Date to;
//    private int number_of_patients;
//    public String eventType;
//
//    public DoctorKafkaEvent() {
//
//    }
//
//    public DoctorKafkaEvent(UUID session_id, UUID doctor_id, Date to, Date from, int number_of_patients, String eventType) {
//        this.session_id = session_id;
//        this.doctor_id = doctor_id;
//        this.to = to;
//        this.from = from;
//        this.number_of_patients = number_of_patients;
//        this.eventType = eventType;
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
//    public UUID getSession_id() {
//        return session_id;
//    }
//
//    public void setSession_id(UUID session_id) {
//        this.session_id = session_id;
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
//
//    public int getNumber_of_patients() {
//        return number_of_patients;
//    }
//
//    public void setNumber_of_patients(int number_of_patients) {
//        this.number_of_patients = number_of_patients;
//    }
//
//    public String getEventType() {
//        return eventType;
//    }
//
//    public void setEventType(String eventType) {
//        this.eventType = eventType;
//    }
//
//
//    @Override
//    public String toString() {
//        return "DoctorKafkaEvent{" +
//                "doctor_id=" + doctor_id +
//                ", session_id=" + session_id +
//                ", from=" + from +
//                ", to=" + to +
//                ", number_of_patients=" + number_of_patients +
//                ", eventType='" + eventType + '\'' +
//                '}';
//    }
//
//}



package com.team06.serviceschedule.dto;

import java.util.Date;
import java.util.UUID;

public class DoctorKafkaEvent {

    private UUID doctor_id;
    private UUID session_id;
    private Date from;
    private Date to;
    private int number_of_patients;
    public String eventType = "AVAILABILITY_SETTLED";

    public DoctorKafkaEvent() {

    }

    public DoctorKafkaEvent(UUID session_id, UUID doctor_id, Date to, Date from, int number_of_patients) {
        this.session_id = session_id;
        this.doctor_id = doctor_id;
        this.to = to;
        this.from = from;
        this.number_of_patients = number_of_patients;
    }

    public UUID getDoctor_id() {
        return doctor_id;
    }

    public void setDoctor_id(UUID doctor_id) {
        this.doctor_id = doctor_id;
    }

    public UUID getSession_id() {
        return session_id;
    }

    public void setSession_id(UUID session_id) {
        this.session_id = session_id;
    }

    public Date getFrom() {
        return from;
    }

    public void setFrom(Date from) {
        this.from = from;
    }

    public Date getTo() {
        return to;
    }

    public void setTo(Date to) {
        this.to = to;
    }

    public int getNumber_of_patients() {
        return number_of_patients;
    }

    public void setNumber_of_patients(int number_of_patients) {
        this.number_of_patients = number_of_patients;
    }

    public String getEventType() {
        return eventType;
    }

    public void setEventType(String eventType) {
        this.eventType = eventType;
    }


    @Override
    public String toString() {
        return "DoctorKafkaEvent{" +
                "doctor_id=" + doctor_id +
                ", session_id=" + session_id +
                ", from=" + from +
                ", to=" + to +
                ", number_of_patients=" + number_of_patients +
                ", eventType='" + eventType + '\'' +
                '}';
    }

}
