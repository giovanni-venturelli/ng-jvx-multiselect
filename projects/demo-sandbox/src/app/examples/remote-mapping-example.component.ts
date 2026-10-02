import {Component} from '@angular/core';
import {JsonPipe} from '@angular/common';
import {Observable, of} from 'rxjs';
import {
  NgJvxGroup,
  NgJvxGroupMapper,
  NgJvxMultiselectComponent,
  NgJvxOptionMapper,
  NgJvxOptionsTemplateDirective
} from 'ng-jvx-multiselect';
import {DemoSectionComponent} from '../shared/demo-section.component';
import {t} from '../shared/i18n';
import {API} from '../shared/sample-data';

interface Person {
  id: number;
  firstName: string;
  lastName: string;
  department: { name: string };
}

interface PersonOption {
  value: number;
  text: string;
  department: string;
}

@Component({
  selector: 'app-remote-mapping-example',
  imports: [NgJvxMultiselectComponent, NgJvxOptionsTemplateDirective, DemoSectionComponent, JsonPipe],
  template: `
    <app-demo-section anchor="remote-mapping" [title]="txt.title" [description]="txt.description" [features]="features"
                      [code]="code">
      <div class="demo-field">
        <label>{{ txt.label }} (GET {{ url }})</label>
        <ng-jvx-multiselect [url]="url" [mapper]="personMapper" [groupBy]="byDepartment" [multi]="true"
                            searchProp="q" [paginationProp]="paginationProp" listProp="results"
                            paginationResponseProp="meta" [paginationResponse]="paginationResponse"
                            [searchInput]="true" searchMode="server" [searchLabel]="txt.search"
                            [(value)]="selected">
          <span placeholder>{{ txt.placeholder }}</span>
          <div *ngJvxOptionsTemplate="let p" class="person">
            <span class="avatar">{{ p.text.charAt(0) }}</span>
            <span>{{ p.text }}</span>
            <small>#{{ p.value }}</small>
          </div>
        </ng-jvx-multiselect>
      </div>
      <pre class="demo-output">value = {{ selected | json }}</pre>
    </app-demo-section>
  `,
  styles: `
    .person { display: flex; align-items: center; gap: .6rem; min-height: 48px; padding-inline: .5rem; }
    .person small { margin-left: auto; color: var(--demo-muted); }
    .avatar {
      width: 1.8rem; height: 1.8rem; border-radius: 50%;
      display: inline-flex; align-items: center; justify-content: center;
      background: var(--demo-accent); color: #fff; font-weight: 700; font-size: .8rem;
    }
  `
})
export class RemoteMappingExampleComponent {
  readonly url = `${API}/people`;
  selected: PersonOption[] = [];

  readonly txt = t({
    en: {
      title: 'API with a custom format',
      description: `When the API uses names other than the defaults, remap them: <code>searchProp</code> and
        <code>paginationProp</code> for the request parameters, <code>listProp</code>,
        <code>paginationResponseProp</code> and <code>paginationResponse</code> for the response. The
        <code>mapper</code> turns each received item into an option; here the options are also grouped by department.`,
      label: 'People',
      search: 'Search by first or last name',
      placeholder: 'Select people'
    },
    it: {
      title: 'API con formato personalizzato',
      description: `Quando l'API usa nomi diversi da quelli predefiniti, li si rimappa: <code>searchProp</code> e
        <code>paginationProp</code> per i parametri della richiesta, <code>listProp</code>,
        <code>paginationResponseProp</code> e <code>paginationResponse</code> per la risposta. Il <code>mapper</code>
        trasforma ogni elemento ricevuto in un'opzione; qui le opzioni sono anche raggruppate per reparto.`,
      label: 'Persone',
      search: 'Cerca per nome o cognome',
      placeholder: 'Seleziona le persone'
    }
  });

  readonly paginationProp = {page: 'pageNumber', pageSize: 'pageLength'};
  readonly paginationResponse = {currentPage: 'current', totalPages: 'pages', totalRows: 'total'};

  readonly personMapper: NgJvxOptionMapper<PersonOption> = {
    mapOption(source: Person): Observable<PersonOption> {
      return of({value: source.id, text: `${source.firstName} ${source.lastName}`, department: source.department.name});
    }
  };

  readonly byDepartment: NgJvxGroupMapper<PersonOption> = {
    mapGroup(option: PersonOption): Observable<NgJvxGroup<PersonOption>> {
      return of({group: option.department, option});
    }
  };

  readonly features = ['[mapper]', 'searchProp', '[paginationProp]', 'listProp', 'paginationResponseProp',
    '[paginationResponse]'];
  readonly code = [
    {
      label: 'HTML', content: `<ng-jvx-multiselect url="/jvx-multiselect-test/people"
                    [mapper]="personMapper" [groupBy]="byDepartment" [multi]="true"
                    searchProp="q"
                    [paginationProp]="{page: 'pageNumber', pageSize: 'pageLength'}"
                    listProp="results"
                    paginationResponseProp="meta"
                    [paginationResponse]="{currentPage: 'current', totalPages: 'pages', totalRows: 'total'}"
                    [searchInput]="true" searchMode="server">
</ng-jvx-multiselect>`
    },
    {
      label: 'TS', content: `personMapper: NgJvxOptionMapper<PersonOption> = {
  mapOption(source: Person): Observable<PersonOption> {
    return of({
      value: source.id,
      text: \`\${source.firstName} \${source.lastName}\`,
      department: source.department.name
    });
  }
};

byDepartment: NgJvxGroupMapper<PersonOption> = {
  mapGroup(option) {
    return of({group: option.department, option});
  }
};`
    },
    {
      label: t({en: 'Request / response', it: 'Richiesta / risposta'}), content: `GET /jvx-multiselect-test/people?q=rossi&pageNumber=1&pageLength=15

{
  "results": [
    {"id": 1000, "firstName": "Mario", "lastName": "Rossi", "department": {"name": "Administration"}},
    ...
  ],
  "meta": {"current": 1, "pages": 1, "total": 20}
}`
    }
  ];
}
