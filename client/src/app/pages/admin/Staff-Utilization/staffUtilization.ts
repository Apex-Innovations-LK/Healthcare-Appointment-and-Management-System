import { Component } from '@angular/core';
import { UtilizationTable } from './components/utilization-table/utilization-table.component';
@Component({
    selector: 'app-staff-utilization',
    standalone: true,
    imports: [UtilizationTable],
    template: `
        <div class="grid grid-cols-12 gap-8">
            <div class="col-span-12">
                <utilization-table></utilization-table>
            </div>
        </div>
    `
})
export class StaffUtilization {
    

}