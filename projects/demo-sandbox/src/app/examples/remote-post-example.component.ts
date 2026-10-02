import {Component, computed, signal} from '@angular/core';
import {HttpHeaders} from '@angular/common/http';
import {JsonPipe} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {NgJvxMultiselectComponent} from 'ng-jvx-multiselect';
import {DemoSectionComponent} from '../shared/demo-section.component';
import {t} from '../shared/i18n';
import {API} from '../shared/sample-data';

@Component({
  selector: 'app-remote-post-example',
  imports: [NgJvxMultiselectComponent, DemoSectionComponent, FormsModule, JsonPipe],
  template: `
    <app-demo-section anchor="remote-post" [title]="txt.title" [description]="txt.description" [features]="features"
                      [code]="code">
      <div class="demo-grid">
        <div class="demo-field">
          <label>POST {{ url }}</label>
          <ng-jvx-multiselect [url]="url" requestType="post" listProp="data" [postPayload]="payload()"
                              [requestHeaders]="headers()" [searchInput]="true" searchMode="server" [multi]="true"
                              [searchLabel]="txt.search">
            <span placeholder>{{ txt.placeholder }}</span>
          </ng-jvx-multiselect>
        </div>
        <div class="demo-controls">
          <label>{{ txt.department }} (postPayload)
            <select [ngModel]="department()" (ngModelChange)="department.set($event)">
              @for (d of departments; track d) {
                <option [value]="d">{{ d }}</option>
              }
            </select>
          </label>
          <label>{{ txt.token }}
            <input type="text" [ngModel]="token()" (ngModelChange)="token.set($event)">
          </label>
        </div>
      </div>
      <pre class="demo-output">postPayload = {{ payload() | json }}</pre>
    </app-demo-section>
  `
})
export class RemotePostExampleComponent {
  readonly url = `${API}/echo`;

  readonly txt = t({
    en: {
      title: 'POST with payload, headers and interceptor',
      description: `With <code>requestType="post"</code> search and pagination are sent in the body
        (<code>{ search, paging: { page, size, sort, ignorePagination } }</code>) and merged with
        <code>postPayload</code>. <code>requestHeaders</code> takes an <code>HttpHeaders</code>. Every call made by the
        library carries the <code>JVXMULTISELECT</code> <code>HttpContextToken</code>: in this demo an interceptor uses
        it to record the calls in the log. The <code>/echo</code> endpoint returns the body and headers it received.`,
      search: 'search',
      placeholder: 'Load with POST',
      department: 'Department',
      token: 'Token (Authorization header)',
      departments: ['sales', 'purchasing', 'logistics']
    },
    it: {
      title: 'POST con payload, header e interceptor',
      description: `Con <code>requestType="post"</code> ricerca e paginazione vengono inviate nel body
        (<code>{ search, paging: { page, size, sort, ignorePagination } }</code>) e unite a
        <code>postPayload</code>. <code>requestHeaders</code> accetta un <code>HttpHeaders</code>. Ogni chiamata della
        libreria porta l'<code>HttpContextToken</code> <code>JVXMULTISELECT</code>: in questa demo un interceptor
        lo usa per registrare le chiamate nel log. L'endpoint <code>/echo</code> restituisce body e header ricevuti.`,
      search: 'cerca',
      placeholder: 'Carica con POST',
      department: 'Reparto',
      token: 'Token (header Authorization)',
      departments: ['vendite', 'acquisti', 'logistica']
    }
  });

  readonly departments = this.txt.departments;
  department = signal(this.departments[0]);
  token = signal('demo-token');

  readonly payload = computed(() => ({department: this.department(), onlyActive: true}));
  readonly headers = computed(() => new HttpHeaders({
    Authorization: `Bearer ${this.token()}`,
    'X-Demo': 'ng-jvx-multiselect'
  }));

  readonly features = ['requestType="post"', '[postPayload]', '[requestHeaders]', 'JVXMULTISELECT'];
  readonly code = [
    {
      label: 'HTML', content: `<ng-jvx-multiselect url="/jvx-multiselect-test/echo" requestType="post" listProp="data"
                    [postPayload]="payload()" [requestHeaders]="headers()"
                    [searchInput]="true" searchMode="server" [multi]="true">
</ng-jvx-multiselect>`
    },
    {
      label: 'TS', content: `department = signal('${this.departments[0]}');
payload = computed(() => ({department: this.department(), onlyActive: true}));
headers = computed(() => new HttpHeaders({
  Authorization: \`Bearer \${this.token()}\`,
  'X-Demo': 'ng-jvx-multiselect'
}));

// body sent:
// {"paging": {"sort": "", "ignorePagination": false, "page": "1", "size": "15"},
//  "department": "${this.departments[0]}", "onlyActive": true}`
    },
    {
      label: 'Interceptor', content: `import {HttpInterceptorFn} from '@angular/common/http';
import {JVXMULTISELECT} from 'ng-jvx-multiselect';

export const jvxHttpLogInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.context.get(JVXMULTISELECT)) {
    return next(req);            // not a library call
  }
  console.log('ng-jvx-multiselect call', req.method, req.urlWithParams);
  return next(req);
};

// app.config.ts
provideHttpClient(withInterceptors([jvxHttpLogInterceptor]))`
    }
  ];
}
