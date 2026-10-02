import {Component} from '@angular/core';
import {Observable, of} from 'rxjs';
import {NgJvxGroup, NgJvxGroupHeaderDirective, NgJvxGroupMapper, NgJvxMultiselectComponent} from 'ng-jvx-multiselect';
import {DemoSectionComponent} from '../shared/demo-section.component';
import {t} from '../shared/i18n';
import {COUNTRIES, Country, FRUITS} from '../shared/sample-data';

@Component({
  selector: 'app-groups-example',
  imports: [NgJvxMultiselectComponent, NgJvxGroupHeaderDirective, DemoSectionComponent],
  template: `
    <app-demo-section anchor="groups" [title]="txt.title" [description]="txt.description" [features]="features" [code]="code">
      <div class="demo-grid">
        <div class="demo-field">
          <label>{{ txt.stringLabel }}</label>
          <ng-jvx-multiselect [options]="fruits" groupBy="category" [multi]="true">
            <span placeholder>{{ txt.stringPlaceholder }}</span>
          </ng-jvx-multiselect>
        </div>
        <div class="demo-field">
          <label>{{ txt.mapperLabel }}</label>
          <ng-jvx-multiselect [options]="countries" itemValue="code" itemText="name" [groupBy]="byContinent"
                              [multi]="true" [searchInput]="true" searchMode="client" [searchLabel]="txt.search">
            <span placeholder>{{ txt.mapperPlaceholder }}</span>
            <div *ngJvxGroupHeader="let g" class="group-header">
              <span>{{ g.group }}</span>
              <small>{{ g.options.length }} {{ txt.countries }}</small>
            </div>
          </ng-jvx-multiselect>
        </div>
      </div>
    </app-demo-section>
  `,
  styles: `
    .group-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      padding: .5rem 15px .25rem;
      font-weight: 700;
      text-transform: uppercase;
      font-size: .75rem;
      letter-spacing: .04em;
      color: var(--demo-accent);
    }
    .group-header small { font-weight: 400; text-transform: none; color: var(--demo-muted); }
  `
})
export class GroupsExampleComponent {
  readonly fruits = FRUITS;
  readonly countries = COUNTRIES;

  readonly txt = t({
    en: {
      title: 'Groups',
      description: `<code>groupBy</code> groups the options. It can be the name of a property or an
        <code>NgJvxGroupMapper</code>, useful for nested properties or computed grouping rules. Group headers can be
        customised with <code>*ngJvxGroupHeader</code>, whose context is <code>{ group, options }</code>.`,
      stringLabel: 'groupBy="category" (string)',
      stringPlaceholder: 'Fruit by category',
      mapperLabel: 'NgJvxGroupMapper on a nested property + custom header',
      mapperPlaceholder: 'Countries by continent',
      search: 'search',
      countries: 'countries'
    },
    it: {
      title: 'Gruppi',
      description: `<code>groupBy</code> raggruppa le opzioni. Può essere il nome di una proprietà oppure un
        <code>NgJvxGroupMapper</code>, utile per proprietà annidate o regole di raggruppamento calcolate.
        L'intestazione dei gruppi si personalizza con <code>*ngJvxGroupHeader</code>, il cui contesto è
        <code>{ group, options }</code>.`,
      stringLabel: 'groupBy="category" (stringa)',
      stringPlaceholder: 'Frutta per categoria',
      mapperLabel: 'NgJvxGroupMapper su proprietà annidata + header custom',
      mapperPlaceholder: 'Paesi per continente',
      search: 'cerca',
      countries: 'paesi'
    }
  });

  readonly byContinent: NgJvxGroupMapper<Country> = {
    mapGroup(option: Country): Observable<NgJvxGroup<Country>> {
      return of({group: option.continent.name, option});
    }
  };

  readonly features = ['groupBy="prop"', '[groupBy]="NgJvxGroupMapper"', '*ngJvxGroupHeader'];
  readonly code = [
    {
      label: 'HTML', content: `<ng-jvx-multiselect [options]="fruits" groupBy="category" [multi]="true">
</ng-jvx-multiselect>

<ng-jvx-multiselect [options]="countries" itemValue="code" itemText="name"
                    [groupBy]="byContinent" [multi]="true">
  <div *ngJvxGroupHeader="let g" class="group-header">
    <span>{{ g.group }}</span>
    <small>{{ g.options.length }} ${this.txt.countries}</small>
  </div>
</ng-jvx-multiselect>`
    },
    {
      label: 'TS', content: `import {NgJvxGroup, NgJvxGroupHeaderDirective, NgJvxGroupMapper} from 'ng-jvx-multiselect';

byContinent: NgJvxGroupMapper<Country> = {
  mapGroup(option: Country): Observable<NgJvxGroup<Country>> {
    return of({group: option.continent.name, option});
  }
};`
    }
  ];
}
