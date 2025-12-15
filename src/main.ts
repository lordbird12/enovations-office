import { registerLocaleData } from '@angular/common';
import { bootstrapApplication } from '@angular/platform-browser';
import localeTh from '@angular/common/locales/th';
import { AppComponent } from 'app/app.component';
import { appConfig } from 'app/app.config';

registerLocaleData(localeTh);

bootstrapApplication(AppComponent, appConfig)
    .catch(err => console.error(err));
