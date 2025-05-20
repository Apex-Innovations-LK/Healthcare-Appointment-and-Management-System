import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientGeneralInfo } from '../../../models/doctor';

@Component({
    selector: 'app-patient-info',
    standalone: true,
    imports: [CommonModule],
    template: ` <div class="container w-full p-4">
        <h2 class="text-xl font-semibold mb-6">Patient General Information</h2>
        <div class="d p-6 w-full h-[50vh] overflow-y-auto">
            <div class="flex flex-col gap-4">
                <div>
                    <label class="patient-key block text-sm font-bold mb-1" for="id"> Id </label>
                    <div class="mt-4 ml-10 border rounded-md py-2 px-3">{{ patientInfo.id }}</div>
                </div>
                <div>
                    <label class="patient-key block text-sm font-bold mb-1" for="name"> Name </label>
                    <div class="mt-4 ml-10 border rounded-md py-2 px-3">{{ patientInfo.first_name + " " + patientInfo.last_name }}</div>
                </div>
                <div>
                    <label class="patient-key block text-sm font-bold mb-1" for="dob"> Date of Birth </label>
                    <div class="mt-4 ml-10 border rounded-md py-2 px-3">{{ patientInfo.date_of_birth }} (Age: {{ getAge(patientInfo.date_of_birth) }})</div>
                </div>
                <div>
                    <label class="patient-key block text-sm font-bold mb-1" for="sex"> Sex </label>
                    <div class="mt-4 ml-10 border rounded-md py-2 px-3 capitalize">{{ patientInfo.gender }}</div>
                </div>
                <div>
                    <label class="patient-key block text-sm font-bold mb-1" for="phone"> Phone </label>
                    <div class="mt-4 ml-10 border rounded-md py-2 px-3">{{ patientInfo.phone_number }}</div>
                </div>
            </div>
        </div>
    </div>`,
    styles: [
        `
            .patient-key {
                color: var(--text-color-secondary);
            }
        `
    ]
})
export class PatientInfoComponent {
    @Input() patientInfo!: PatientGeneralInfo;

    getAge(dobString: string): number {
        const dob = new Date(dobString);
        const today = new Date();

        let age = today.getFullYear() - dob.getFullYear();
        const monthDifference = today.getMonth() - dob.getMonth();

        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < dob.getDate())) {
            age--;
        }

        return age;
    }
}
