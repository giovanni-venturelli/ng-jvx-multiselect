import {Component} from '@angular/core';
import {
  NgJvxDisabledOptionDirective,
  NgJvxMultisectChipComponent,
  NgJvxMultiselectComponent,
  NgJvxOptionsTemplateDirective,
  NgJvxSelectionTemplateDirective
} from 'ng-jvx-multiselect';
import {DemoSectionComponent} from '../shared/demo-section.component';
import {t} from '../shared/i18n';
import {FRUITS, Fruit} from '../shared/sample-data';

@Component({
  selector: 'app-templates-example',
  imports: [
    NgJvxMultiselectComponent,
    NgJvxOptionsTemplateDirective,
    NgJvxSelectionTemplateDirective,
    NgJvxDisabledOptionDirective,
    NgJvxMultisectChipComponent,
    DemoSectionComponent
  ],
  template: `
    <app-demo-section anchor="templates" [title]="txt.title" [description]="txt.description" [features]="features"
                      [code]="code">
      <div class="demo-grid">
        <div class="demo-field">
          <label>{{ txt.multiLabel }}</label>
          <ng-jvx-multiselect [options]="fruits" [multi]="true" [(value)]="selected" [clearable]="true">
            <span placeholder>{{ txt.multiPlaceholder }}</span>

            <div *ngJvxOptionsTemplate="let fruit" class="fruit-option" [ngJvxDisabledOption]="!fruit.seasonal">
              <span class="swatch" [style.background]="fruit.color"></span>
              <span class="fruit-name">{{ fruit.text }}</span>
              <small>{{ fruit.category }} · {{ fruit.kcal }} kcal</small>
              @if (!fruit.seasonal) {
                <small class="tag">{{ txt.outOfSeason }}</small>
              }
            </div>

            <ng-container *ngJvxSelectionTemplate="let fruits">
              <div class="chips">
                @for (fruit of fruits; track fruit.value) {
                  <ng-jvx-multiselect-chip [value]="fruit">
                    <span class="swatch" [style.background]="fruit.color"></span> {{ fruit.text }}
                  </ng-jvx-multiselect-chip>
                }
              </div>
            </ng-container>

            <div ng-jvx-footer class="panel-footer">
              {{ selected.length }} {{ txt.selected }} · {{ totalKcal() }} {{ txt.totalKcal }}
            </div>
          </ng-jvx-multiselect>
        </div>

        <div class="demo-field">
          <label>{{ txt.singleLabel }}</label>
          <ng-jvx-multiselect [options]="fruits" [(value)]="single">
            <span placeholder>{{ txt.singlePlaceholder }}</span>
            <ng-container *ngJvxSelectionTemplate="let fruit">
              <span class="selected-fruit">
                <span class="swatch" [style.background]="fruit.color"></span>
                <strong>{{ fruit.text }}</strong> <small>({{ fruit.category }})</small>
              </span>
            </ng-container>
          </ng-jvx-multiselect>
        </div>
      </div>
    </app-demo-section>
  `,
  styles: `
    .fruit-option {
      display: flex;
      align-items: center;
      gap: .5rem;
      min-height: 48px;
      padding-inline: .5rem;
    }
    .fruit-option small { color: var(--demo-muted); }
    .fruit-option .tag { margin-left: auto; font-style: italic; }
    .fruit-name { font-weight: 600; }
    .swatch {
      display: inline-block;
      width: .75rem;
      height: .75rem;
      border-radius: 50%;
      flex: none;
    }
    .chips { display: flex; gap: .3rem; flex-wrap: wrap; }
    .selected-fruit { display: inline-flex; align-items: center; gap: .4rem; }
    .panel-footer {
      padding: .5rem .75rem;
      font-size: .85rem;
      border-top: 1px solid var(--demo-border);
    }
  `
})
export class TemplatesExampleComponent {
  readonly fruits = FRUITS;
  selected: Fruit[] = [FRUITS[0], FRUITS[7]];
  single: Fruit[] = [FRUITS[10]];

  readonly txt = t({
    en: {
      title: 'Custom templates',
      description: `<code>*ngJvxOptionsTemplate</code> defines how each option looks, <code>*ngJvxSelectionTemplate</code>
        how the selected value looks (in multiple selection the context is the array of selected options, in single
        selection the selected option). <code>[ngJvxDisabledOption]</code> makes an option unselectable, the
        <code>&lt;ng-jvx-multiselect-chip&gt;</code> component can be reused in templates, and the
        <code>ng-jvx-footer</code> slot adds a footer to the panel.`,
      multiLabel: 'Multiple: rich options, custom chips, out-of-season items disabled',
      multiPlaceholder: 'Pick seasonal fruit',
      outOfSeason: 'out of season',
      selected: 'selected',
      totalKcal: 'kcal in total',
      singleLabel: 'Single: selection template',
      singlePlaceholder: 'Your favourite fruit'
    },
    it: {
      title: 'Template personalizzati',
      description: `<code>*ngJvxOptionsTemplate</code> definisce l'aspetto di ogni opzione, <code>*ngJvxSelectionTemplate</code>
        quello del valore selezionato (in multipla il contesto è l'array delle selezioni, in singola la singola opzione).
        <code>[ngJvxDisabledOption]</code> rende un'opzione non selezionabile, il componente
        <code>&lt;ng-jvx-multiselect-chip&gt;</code> si può riusare nei template e lo slot <code>ng-jvx-footer</code>
        aggiunge un piè di pagina al pannello.`,
      multiLabel: 'Multipla: opzioni ricche, chip custom, fuori stagione disabilitati',
      multiPlaceholder: 'Scegli la frutta di stagione',
      outOfSeason: 'fuori stagione',
      selected: 'selezionati',
      totalKcal: 'kcal totali',
      singleLabel: 'Singola: template della selezione',
      singlePlaceholder: 'Il tuo frutto preferito'
    }
  });

  totalKcal(): number {
    return this.selected.reduce((sum, f) => sum + f.kcal, 0);
  }

  readonly features = ['*ngJvxOptionsTemplate', '*ngJvxSelectionTemplate', '[ngJvxDisabledOption]',
    '<ng-jvx-multiselect-chip>', 'ng-jvx-footer'];
  readonly code = [
    {
      label: 'HTML', content: `<ng-jvx-multiselect [options]="fruits" [multi]="true" [(value)]="selected">
  <span placeholder>${this.txt.multiPlaceholder}</span>

  <!-- option template, with disabled options -->
  <div *ngJvxOptionsTemplate="let fruit" class="fruit-option" [ngJvxDisabledOption]="!fruit.seasonal">
    <span class="swatch" [style.background]="fruit.color"></span>
    <span>{{ fruit.text }}</span>
    <small>{{ fruit.category }} · {{ fruit.kcal }} kcal</small>
  </div>

  <!-- selection template: in multiple selection the context is the selected array -->
  <ng-container *ngJvxSelectionTemplate="let fruits">
    @for (fruit of fruits; track fruit.value) {
      <ng-jvx-multiselect-chip [value]="fruit">{{ fruit.text }}</ng-jvx-multiselect-chip>
    }
  </ng-container>

  <!-- panel footer -->
  <div ng-jvx-footer>{{ selected.length }} ${this.txt.selected}</div>
</ng-jvx-multiselect>

<!-- in single selection the context is the selected option -->
<ng-jvx-multiselect [options]="fruits" [(value)]="single">
  <ng-container *ngJvxSelectionTemplate="let fruit">
    <strong>{{ fruit.text }}</strong> ({{ fruit.category }})
  </ng-container>
</ng-jvx-multiselect>`
    },
    {
      label: 'TS', content: `import {
  NgJvxDisabledOptionDirective, NgJvxMultisectChipComponent, NgJvxMultiselectComponent,
  NgJvxOptionsTemplateDirective, NgJvxSelectionTemplateDirective
} from 'ng-jvx-multiselect';

@Component({
  imports: [NgJvxMultiselectComponent, NgJvxOptionsTemplateDirective, NgJvxSelectionTemplateDirective,
            NgJvxDisabledOptionDirective, NgJvxMultisectChipComponent],
  ...
})`
    }
  ];
}
