import {Component, signal} from '@angular/core';
import {JsonPipe} from '@angular/common';
import {NgJvxMultiselectComponent} from 'ng-jvx-multiselect';
import {DemoSectionComponent} from '../shared/demo-section.component';
import {t} from '../shared/i18n';
import {Option, SIMPLE_OPTIONS} from '../shared/sample-data';

@Component({
  selector: 'app-basic-example',
  imports: [NgJvxMultiselectComponent, DemoSectionComponent, JsonPipe],
  template: `
    <app-demo-section anchor="single" [title]="txt.title" [description]="txt.description" [features]="features" [code]="code">
      <div class="demo-grid">
        <div class="demo-field">
          <label>{{ txt.label }}</label>
          <ng-jvx-multiselect [options]="options" [(value)]="value" [disabled]="disabled()" [clearable]="clearable()">
            <span placeholder>{{ txt.placeholder }}</span>
          </ng-jvx-multiselect>
        </div>
        <div class="demo-controls">
          <label><input type="checkbox" [checked]="disabled()" (change)="disabled.set(!disabled())"> disabled</label>
          <label><input type="checkbox" [checked]="clearable()" (change)="clearable.set(!clearable())"> clearable</label>
          <button type="button" (click)="value = [options[2]]">{{ txt.setThird }}</button>
          <button type="button" (click)="value = []">{{ txt.clear }}</button>
        </div>
      </div>
      <pre class="demo-output">value = {{ value | json }}</pre>
    </app-demo-section>
  `
})
export class BasicExampleComponent {
  readonly options = SIMPLE_OPTIONS;
  value: Option[] = [SIMPLE_OPTIONS[0]];
  disabled = signal(false);
  clearable = signal(true);

  readonly txt = t({
    en: {
      title: 'Single selection',
      description: `The minimal setup: an array of <code>{value, text}</code> options passed to <code>[options]</code>.
        The value is always an <strong>array</strong> of options, even in single selection, and supports two-way
        binding with <code>[(value)]</code>. The <code>placeholder</code> slot is shown when nothing is selected.`,
      label: 'Option',
      placeholder: 'Select an option…',
      setThird: `Set "${SIMPLE_OPTIONS[2].text}"`,
      clear: 'Clear'
    },
    it: {
      title: 'Selezione singola',
      description: `L'uso minimo: un array di opzioni <code>{value, text}</code> passato a <code>[options]</code>.
        Il valore è sempre un <strong>array</strong> di opzioni, anche in selezione singola, e supporta il
        two-way binding <code>[(value)]</code>. Lo slot <code>placeholder</code> compare quando non c'è selezione.`,
      label: 'Opzione',
      placeholder: 'Seleziona un\'opzione…',
      setThird: `Imposta "${SIMPLE_OPTIONS[2].text}"`,
      clear: 'Svuota'
    }
  });

  readonly features = ['[options]', '[(value)]', '[disabled]', '[clearable]', 'placeholder'];
  readonly code = [
    {
      label: 'HTML', content: `<ng-jvx-multiselect [options]="options" [(value)]="value"
                    [disabled]="disabled" [clearable]="true">
  <span placeholder>${this.txt.placeholder}</span>
</ng-jvx-multiselect>`
    },
    {
      label: 'TS', content: `import {NgJvxMultiselectComponent} from 'ng-jvx-multiselect';

@Component({
  imports: [NgJvxMultiselectComponent],
  ...
})
export class BasicExampleComponent {
  options = [{value: 1, text: '${SIMPLE_OPTIONS[0].text}'}, {value: 2, text: '${SIMPLE_OPTIONS[1].text}'}, ...];
  // the value is an array even in single selection
  value = [this.options[0]];
}`
    }
  ];
}
