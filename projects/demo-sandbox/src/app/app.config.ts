import {ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import {provideHttpClient, withInterceptors, withXhr} from '@angular/common/http';
import {jvxHttpLogInterceptor} from './shared/jvx-http-log.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({eventCoalescing: true}),
    provideHttpClient(withInterceptors([jvxHttpLogInterceptor]), withXhr())
  ]
};
