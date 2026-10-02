import {Component, inject} from '@angular/core';
import {NgJvxMultiselectComponent} from 'ng-jvx-multiselect';
import {DemoSectionComponent} from '../shared/demo-section.component';
import {EventLogService} from '../shared/event-log.service';
import {t} from '../shared/i18n';
import {API, Option} from '../shared/sample-data';

@Component({
  selector: 'app-remote-get-example',
  imports: [NgJvxMultiselectComponent, DemoSectionComponent],
  template: `
    <app-demo-section anchor="remote-get" [title]="txt.title" [description]="txt.description" [features]="features"
                      [code]="code">
      <div class="demo-grid">
        <div class="demo-field">
          <label>GET {{ url }}</label>
          <ng-jvx-multiselect #remote [url]="url" listProp="data" [pageSize]="20" [multi]="true"
                              [searchInput]="true" searchMode="server" [searchLabel]="txt.search"
                              [clearable]="true" [(value)]="selected"
                              (scrollEnd)="log.event('remote-get', 'scrollEnd')">
            <span placeholder>{{ txt.placeholder }}</span>
          </ng-jvx-multiselect>
        </div>
        <div class="demo-output-inline">
          <div><strong>totalRows()</strong>: {{ remote.totalRows() }}</div>
          <div><strong>totalPages()</strong>: {{ remote.totalPages() }}</div>
          <div><strong>isLoading()</strong>: {{ remote.isLoading() }}</div>
          <div><strong>{{ txt.selected }}</strong>: {{ selected.length }}</div>
        </div>
      </div>
    </app-demo-section>
  `
})
export class RemoteGetExampleComponent {
  readonly log = inject(EventLogService);
  readonly url = `${API}/get-test`;
  selected: Option[] = [];

  readonly txt = t({
    en: {
      title: 'Options from a backend (GET, pagination, server search)',
      description: `With <code>url</code> the options are loaded when the menu opens. Further pages arrive as you
        scroll to the bottom (infinite scroll, minimum <code>pageSize</code> is 15). <code>listProp</code> tells where
        the list is in the response and <code>paginationResponseProp</code> where the pagination info is. With
        <code>searchMode="server"</code> the search text is sent as the <code>searchProp</code> parameter. Open the log
        panel to see the calls.`,
      search: 'Search on the server…',
      placeholder: 'Load from the server',
      selected: 'selected',
      results: 'results',
      pages: 'pages'
    },
    it: {
      title: 'Opzioni da backend (GET, paginazione, ricerca server)',
      description: `Con <code>url</code> le opzioni vengono caricate all'apertura del menu. Le pagine successive arrivano
        scorrendo fino in fondo (scroll infinito, <code>pageSize</code> minimo 15). <code>listProp</code> indica dove si
        trova la lista nella risposta e <code>paginationResponseProp</code> dove si trovano le informazioni di
        paginazione. Con <code>searchMode="server"</code> il testo cercato viene inviato come parametro
        <code>searchProp</code>. Apri il pannello di log per vedere le chiamate.`,
      search: 'Cerca sul server…',
      placeholder: 'Carica dal server',
      selected: 'selezionati',
      results: 'risultati',
      pages: 'pagine'
    }
  });

  readonly features = ['url', 'requestType="get"', 'listProp', '[pageSize]', 'searchMode="server"', 'searchProp',
    'paginationResponseProp', '(scrollEnd)', 'totalRows()', 'totalPages()'];
  readonly code = [
    {
      label: 'HTML', content: `<ng-jvx-multiselect #remote
                    url="/jvx-multiselect-test/get-test"
                    listProp="data"
                    [pageSize]="20"
                    [multi]="true"
                    [searchInput]="true" searchMode="server"
                    [(value)]="selected"
                    (scrollEnd)="onScrollEnd()">
</ng-jvx-multiselect>

<span>{{ remote.totalRows() }} ${this.txt.results}, {{ remote.totalPages() }} ${this.txt.pages}</span>`
    },
    {
      label: t({en: 'Request / response', it: 'Richiesta / risposta'}), content: `GET /jvx-multiselect-test/get-test?search=12&page=1&size=20

{
  "data": [{"value": 12, "text": "value 12"}, ...],
  "pagingInfo": {"pageNo": 1, "pageCount": 1, "totalRecordCount": 12}
}

// defaults:
// searchProp = 'search'
// paginationProp = {page: 'page', pageSize: 'size'}
// paginationResponseProp = 'pagingInfo'
// paginationResponse = {currentPage: 'pageNo', totalPages: 'pageCount', totalRows: 'totalRecordCount'}`
    }
  ];
}
