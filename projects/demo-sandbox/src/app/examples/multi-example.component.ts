import {Component, signal} from '@angular/core';
import {JsonPipe} from '@angular/common';
import {NgJvxMultiselectComponent} from 'ng-jvx-multiselect';
import {DemoSectionComponent} from '../shared/demo-section.component';
import {t} from '../shared/i18n';
import {FRUITS, Fruit} from '../shared/sample-data';

@Component({
  selector: 'app-multi-example',
  imports: [NgJvxMultiselectComponent, DemoSectionComponent, JsonPipe],
  template: `
    <app-demo-section anchor="multi" [title]="txt.title" [description]="txt.description" [features]="features" [code]="code">
      <div class="demo-grid">
        <div class="demo-field">
          <label>{{ txt.multiLabel }}</label>
          <ng-jvx-multiselect [options]="fruits" [multi]="true" [(value)]="selected"
                              [clearable]="clearable()" [closeButton]="closeButton()">
            <span placeholder>{{ txt.multiPlaceholder }}</span>
          </ng-jvx-multiselect>
        </div>
        <div class="demo-controls">
          <label><input type="checkbox" [checked]="clearable()" (change)="clearable.set(!clearable())"> clearable</label>
          <label><input type="checkbox" [checked]="closeButton()" (change)="closeButton.set(!closeButton())"> closeButton</label>
        </div>
        <div class="demo-field">
          <label>{{ txt.singleLabel }} (closeOnClick = {{ closeOnClick() }})</label>
          <ng-jvx-multiselect [options]="fruits" [closeOnClick]="closeOnClick()" [(value)]="single">
            <span placeholder>{{ txt.singlePlaceholder }}</span>
          </ng-jvx-multiselect>
        </div>
        <div class="demo-controls">
          <label><input type="checkbox" [checked]="closeOnClick()" (change)="closeOnClick.set(!closeOnClick())"> closeOnClick</label>
        </div>
      </div>
      <pre class="demo-output">multi = {{ selectedTexts() | json }}
single = {{ single[0]?.text ?? '—' }}</pre>
    </app-demo-section>
  `
})
export class MultiExampleComponent {
  readonly fruits = FRUITS;
  selected: Fruit[] = [FRUITS[0], FRUITS[4]];
  single: Fruit[] = [];
  clearable = signal(true);
  closeButton = signal(true);
  closeOnClick = signal(false);

  readonly txt = t({
    en: {
      title: 'Multiple selection',
      description: `With <code>[multi]="true"</code> the selected options become removable chips. The menu stays open
        while selecting and closes with the <code>closeButton</code> or by clicking outside. In single selection
        <code>[closeOnClick]="false"</code> keeps the menu open after a choice.`,
      multiLabel: 'Fruit (multiple)',
      multiPlaceholder: 'Pick one or more fruits',
      singleLabel: 'Fruit (single)',
      singlePlaceholder: 'Pick a fruit'
    },
    it: {
      title: 'Selezione multipla',
      description: `Con <code>[multi]="true"</code> le opzioni selezionate diventano chip rimovibili. Il menu resta aperto
        mentre si seleziona e si chiude con il pulsante <code>closeButton</code> o cliccando fuori.
        In selezione singola <code>[closeOnClick]="false"</code> tiene il menu aperto dopo la scelta.`,
      multiLabel: 'Frutta (multipla)',
      multiPlaceholder: 'Scegli uno o più frutti',
      singleLabel: 'Frutta (singola)',
      singlePlaceholder: 'Scegli un frutto'
    }
  });

  selectedTexts(): string[] {
    return this.selected.map(f => f.text);
  }

  readonly features = ['[multi]', '[closeButton]', '[closeOnClick]', '[clearable]'];
  readonly code = [
    {
      label: 'HTML', content: `<ng-jvx-multiselect [options]="fruits" [multi]="true" [(value)]="selected"
                    [clearable]="true" [closeButton]="true">
  <span placeholder>${this.txt.multiPlaceholder}</span>
</ng-jvx-multiselect>

<!-- single selection that keeps the menu open after a click -->
<ng-jvx-multiselect [options]="fruits" [closeOnClick]="false" [(value)]="single">
</ng-jvx-multiselect>`
    }
  ];
}
