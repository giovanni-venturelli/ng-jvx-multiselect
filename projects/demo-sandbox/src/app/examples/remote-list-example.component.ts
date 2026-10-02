import {Component} from '@angular/core';
import {JsonPipe} from '@angular/common';
import {Observable, of} from 'rxjs';
import {NgJvxMultiOptionMapper, NgJvxMultiselectComponent} from 'ng-jvx-multiselect';
import {DemoSectionComponent} from '../shared/demo-section.component';
import {t} from '../shared/i18n';
import {API, Option} from '../shared/sample-data';

const ALL: Option = {value: 0, text: t({en: 'All', it: 'Tutti'})};

@Component({
  selector: 'app-remote-list-example',
  imports: [NgJvxMultiselectComponent, DemoSectionComponent, JsonPipe],
  template: `
    <app-demo-section anchor="remote-list" [title]="txt.title" [description]="txt.description" [features]="features"
                      [code]="code">
      <div class="demo-field">
        <label>GET {{ url }}</label>
        <ng-jvx-multiselect [url]="url" [ignorePagination]="true" [multiMapper]="withAll" [multi]="true"
                            [searchInput]="true" searchMode="server" [searchLabel]="txt.search"
                            [value]="selected" (valueChange)="onValueChange($event)">
          <span placeholder>{{ txt.placeholder }}</span>
        </ng-jvx-multiselect>
      </div>
      <pre class="demo-output">value = {{ texts() | json }}</pre>
    </app-demo-section>
  `
})
export class RemoteListExampleComponent {
  readonly url = `${API}/list`;
  selected: Option[] = [ALL];

  readonly txt = t({
    en: {
      title: 'Non-paginated list and multiMapper',
      description: `<code>[ignorePagination]="true"</code> loads every option in a single call. When
        <code>listProp</code> is empty, the response must be an array. <code>multiMapper</code> receives the whole
        response before the single options are mapped: here it adds an "${ALL.text}" option, made exclusive by
        handling <code>(valueChange)</code>.`,
      search: 'search',
      placeholder: 'Full list'
    },
    it: {
      title: 'Lista non paginata e multiMapper',
      description: `<code>[ignorePagination]="true"</code> carica tutte le opzioni in una sola chiamata. Se
        <code>listProp</code> è vuoto, la risposta deve essere direttamente un array. <code>multiMapper</code>
        riceve la risposta intera prima del mapping delle singole opzioni: qui aggiunge un'opzione "${ALL.text}", resa
        esclusiva gestendo <code>(valueChange)</code>.`,
      search: 'cerca',
      placeholder: 'Lista completa'
    }
  });

  readonly withAll: NgJvxMultiOptionMapper<Option> = {
    mapOptions(source: Option[]): Observable<Option[]> {
      return of([ALL, ...source]);
    }
  };

  texts(): string[] {
    return this.selected.map(o => o.text);
  }

  onValueChange(next: Option[]): void {
    const hadAll = this.selected.some(o => o.value === ALL.value);
    const hasAll = next.some(o => o.value === ALL.value);
    if (hasAll && !hadAll) {
      // "All" just picked: drop the other selections
      this.selected = [ALL];
    } else if (hasAll && next.length > 1) {
      // a specific option picked: "All" no longer applies
      this.selected = next.filter(o => o.value !== ALL.value);
    } else {
      this.selected = next;
    }
  }

  readonly features = ['[ignorePagination]', '[multiMapper]', '[value]', '(valueChange)'];
  readonly code = [
    {
      label: 'HTML', content: `<ng-jvx-multiselect url="/jvx-multiselect-test/list" [ignorePagination]="true"
                    [multiMapper]="withAll" [multi]="true"
                    [value]="selected" (valueChange)="onValueChange($event)">
</ng-jvx-multiselect>`
    },
    {
      label: 'TS', content: `const ALL = {value: 0, text: '${ALL.text}'};

withAll: NgJvxMultiOptionMapper<Option> = {
  mapOptions(source: Option[]): Observable<Option[]> {
    return of([ALL, ...source]);
  }
};

onValueChange(next: Option[]): void {
  const hadAll = this.selected.some(o => o.value === ALL.value);
  const hasAll = next.some(o => o.value === ALL.value);
  if (hasAll && !hadAll) {
    this.selected = [ALL];
  } else if (hasAll && next.length > 1) {
    this.selected = next.filter(o => o.value !== ALL.value);
  } else {
    this.selected = next;
  }
}`
    }
  ];
}
