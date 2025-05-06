// package DoctorMicroservice.service.impl;

// import org.springframework.stereotype.Service;

// import DoctorMicroservice.dto.DoctorDto;
// import DoctorMicroservice.entity.Doctor;
// import DoctorMicroservice.mapper.DoctorMapper;
// import DoctorMicroservice.repository.DoctorRepository;
// import DoctorMicroservice.service.DoctorService;
// import jakarta.transaction.Transactional;
// import lombok.AllArgsConstructor;

// @Service
// @AllArgsConstructor
// @Transactional
// public class DoctorServiceImpl implements DoctorService {

//     private final DoctorRepository doctorRepository;

//     @Override
//     public DoctorDto addDoctor(DoctorDto doctorDto) {
//         Doctor doctor = DoctorMapper.mapToDoctor(doctorDto);
//         Doctor savedDoc = doctorRepository.save(doctor);
//         return DoctorMapper.mapToDoctorDto(savedDoc);

//     };
// }
