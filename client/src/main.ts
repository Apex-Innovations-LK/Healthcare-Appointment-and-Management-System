import { bootstrapApplication } from '@angular/platform-browser';
<<<<<<< HEAD
<<<<<<< HEAD
import { appConfig } from './app.config';
import { AppComponent } from './app.component';

bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));
=======
=======
>>>>>>> 854da2fe9565f52bb541b5ca2fb37b7b3d497d0c
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
<<<<<<< HEAD
>>>>>>> ccb02e3 (Added Notification Microservice with Spring Boot and FastAPI Kafka integration)
=======
>>>>>>> 854da2fe9565f52bb541b5ca2fb37b7b3d497d0c
