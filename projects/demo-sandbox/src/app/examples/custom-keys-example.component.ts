import {Component} from '@angular/core';
import {JsonPipe} from '@angular/common';
import {NgJvxMultiselectComponent} from 'ng-jvx-multiselect';
import {DemoSectionComponent} from '../shared/demo-section.component';
import {t} from '../shared/i18n';
import {COUNTRIES, Country} from '../shared/sample-data';

@Component({
  selector: 'app-custom-keys-example',
  imports: [NgJvxMultiselectComponent, DemoSectionComponent, JsonPipe],
  template: `
    <app-demo-section anchor="custom-keys" [title]="txt.title" [description]="txt.description" [features]="features" [code]="code">
      <div class="demo-field">
        <label>{{ txt.label }}</label>
        <ng-jvx-multiselect [options]="countries" itemValue="code" itemText="name" [multi]="true" [(value)]="selected">
          <span placeholder>{{ txt.placeholder }}</span>
        </ng-jvx-multiselect>
      </div>
      <pre class="demo-output">value = {{ selected | json }}</pre>
    </app-demo-section>
  `
})
export class CustomKeysExampleComponent {
  readonly countries = COUNTRIES;
  selected: Country[] = [COUNTRIES[0]];

  readonly txt = t({
    en: {
      title: 'Custom keys',
      description: `When the options don't have <code>value</code> / <code>text</code> properties, use
        <code>itemValue</code> and <code>itemText</code> to choose which property is the key and which is the label.`,
      label: 'Countries',
      placeholder: 'Select the countries'
    },
    it: {
      title: 'Chiavi personalizzate',
      description: `Se le opzioni non hanno le proprietà <code>value</code> / <code>text</code>, con <code>itemValue</code> e
        <code>itemText</code> si indica quale proprietà fa da chiave e quale da etichetta.`,
      label: 'Paesi',
      placeholder: 'Seleziona i paesi'
    }
  });

  readonly features = ['itemValue', 'itemText'];
  readonly code = [
    {
      label: 'HTML', content: `<ng-jvx-multiselect [options]="countries" itemValue="code" itemText="name"
                    [multi]="true" [(value)]="selected">
</ng-jvx-multiselect>`
    },
    {
      label: 'TS', content: `countries = [
  {code: '${COUNTRIES[0].code}', name: '${COUNTRIES[0].name}', continent: {name: '${COUNTRIES[0].continent.name}'}},
  {code: '${COUNTRIES[1].code}', name: '${COUNTRIES[1].name}', continent: {name: '${COUNTRIES[1].continent.name}'}},
  ...
];`
    }
  ];
}
