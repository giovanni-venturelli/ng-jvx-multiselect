import {HttpInterceptorFn, HttpResponse} from '@angular/common/http';
import {inject} from '@angular/core';
import {tap} from 'rxjs/operators';
import {JVXMULTISELECT} from 'ng-jvx-multiselect';
import {EventLogService} from './event-log.service';

/**
 * Le chiamate della libreria sono marcate con l'HttpContextToken JVXMULTISELECT:
 * un interceptor può riconoscerle e trattarle in modo diverso (qui le registra nel log).
 */
export const jvxHttpLogInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.context.get(JVXMULTISELECT)) {
    return next(req);
  }
  const log = inject(EventLogService);
  const params = req.params.keys().length > 0 ? `?${req.params.toString()}` : '';
  const label = `${req.method} ${req.url}${params}`;
  log.log('http', 'HttpClient', `→ ${label}`, req.body ?? undefined);
  return next(req).pipe(
    tap({
      next: event => {
        if (event instanceof HttpResponse) {
          log.log('http', 'HttpClient', `← ${event.status} ${req.method} ${req.url}`, event.body);
        }
      },
      error: err => log.log('http', 'HttpClient', `✕ ${req.method} ${req.url}`, err?.message ?? err)
    })
  );
};
