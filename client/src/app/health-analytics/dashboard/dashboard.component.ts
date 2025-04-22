import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button'; 

@Component({
  selector: 'app-dashboard',
  standalone: true, 
  imports: [ButtonModule, RouterModule], 
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {}
