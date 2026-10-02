import {Component} from '@angular/core';
import {Observable, of} from 'rxjs';
import {NgJvxMultiselectComponent, NgJvxSearchMapper} from 'ng-jvx-multiselect';
import {DemoSectionComponent} from '../shared/demo-section.component';
import {t} from '../shared/i18n';
import {COUNTRIES, Country, FRUITS, Fruit} from '../shared/sample-data';

const normalize = (s: string): string => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

@Component({
  selector: 'app-client-search-example',
  imports: [NgJvxMultiselectComponent, DemoSectionComponent],
  template: `
    <app-demo-section anchor="client-search" [title]="txt.title" [description]="txt.description" [features]="features"
                      [code]="code">
      <div class="demo-grid">
        <div class="demo-field">
          <label>{{ txt.defaultLabel }}</label>
          <ng-jvx-multiselect [options]="fruits" [multi]="true" [searchInput]="true" searchMode="client"
                              [searchLabel]="txt.fruitSearch">
            <span placeholder>{{ txt.fruitPlaceholder }}</span>
          </ng-jvx-multiselect>
        </div>
        <div class="demo-field">
          <label>{{ txt.mapperLabel }}</label>
          <ng-jvx-multiselect [options]="countries" itemValue="code" itemText="name" [multi]="true"
                              [searchInput]="true" searchMode="client" [searchLabel]="txt.countrySearch"
                              [searchMapper]="countrySearch">
            <span placeholder>{{ txt.countryPlaceholder }}</span>
          </ng-jvx-multiselect>
        </div>
      </div>
    </app-demo-section>
  `
})
export class ClientSearchExampleComponent {
  readonly fruits: Fruit[] = FRUITS;
  readonly countries: Country[] = COUNTRIES;

  readonly txt = t({
    en: {
      title: 'Client-side search',
      description: `<code>[searchInput]="true"</code> adds a search box to the panel and <code>searchLabel</code> sets
        its placeholder. With <code>searchMode="client"</code> filtering happens on the options already loaded; by
        default it matches the <code>itemText</code> field, but a <code>searchMapper</code> allows any logic.`,
      defaultLabel: 'Default search (on itemText)',
      mapperLabel: 'searchMapper: name or code, accent-insensitive',
      fruitSearch: 'Search a fruit…',
      fruitPlaceholder: 'Fruit',
      countrySearch: 'E.g. "it" or "italy"',
      countryPlaceholder: 'Countries'
    },
    it: {
      title: 'Ricerca lato client',
      description: `<code>[searchInput]="true"</code> mostra il campo di ricerca nel pannello, <code>searchLabel</code> ne
        imposta il placeholder. Con <code>searchMode="client"</code> il filtro avviene sulle opzioni già caricate; di
        default cerca nel campo <code>itemText</code>, ma un <code>searchMapper</code> permette qualsiasi logica.`,
      defaultLabel: 'Ricerca predefinita (su itemText)',
      mapperLabel: 'searchMapper: nome o codice, ignorando gli accenti',
      fruitSearch: 'Cerca un frutto…',
      fruitPlaceholder: 'Frutta',
      countrySearch: 'Es. «it» o «italia»',
      countryPlaceholder: 'Paesi'
    }
  });

  readonly countrySearch: NgJvxSearchMapper<Country> = {
    mapSearch(search: string, options: Country[]): Observable<Country[]> {
      const term = normalize(search ?? '');
      return of(options.filter(c => normalize(c.name).includes(term) || c.code.toLowerCase() === term));
    }
  };

  readonly features = ['[searchInput]', 'searchMode="client"', 'searchLabel', '[searchMapper]'];
  readonly code = [
    {
      label: 'HTML', content: `<ng-jvx-multiselect [options]="fruits" [multi]="true"
                    [searchInput]="true" searchMode="client" searchLabel="${this.txt.fruitSearch}">
</ng-jvx-multiselect>

<ng-jvx-multiselect [options]="countries" itemValue="code" itemText="name" [multi]="true"
                    [searchInput]="true" searchMode="client"
                    [searchMapper]="countrySearch">
</ng-jvx-multiselect>`
    },
    {
      label: 'TS', content: `import {NgJvxSearchMapper} from 'ng-jvx-multiselect';

const normalize = (s: string) => s.normalize('NFD').replace(/[\\u0300-\\u036f]/g, '').toLowerCase();

countrySearch: NgJvxSearchMapper<Country> = {
  mapSearch(search: string, options: Country[]): Observable<Country[]> {
    const term = normalize(search ?? '');
    return of(options.filter(c => normalize(c.name).includes(term) || c.code.toLowerCase() === term));
  }
};`
    }
  ];
}
