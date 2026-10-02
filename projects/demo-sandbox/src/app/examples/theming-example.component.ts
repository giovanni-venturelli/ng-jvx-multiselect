import {Component} from '@angular/core';
import {NgJvxMultiselectComponent} from 'ng-jvx-multiselect';
import {DemoSectionComponent} from '../shared/demo-section.component';
import {t} from '../shared/i18n';
import {FRUITS, Fruit} from '../shared/sample-data';

@Component({
  selector: 'app-theming-example',
  imports: [NgJvxMultiselectComponent, DemoSectionComponent],
  template: `
    <app-demo-section anchor="theming" [title]="txt.title" [description]="txt.description" [features]="features" [code]="code">
      <div class="demo-grid">
        <div class="demo-field">
          <label>{{ txt.defaultLabel }}</label>
          <ng-jvx-multiselect [options]="fruits" [multi]="true" [value]="value">
            <span placeholder>{{ txt.defaultLabel }}</span>
          </ng-jvx-multiselect>
        </div>
        <div class="demo-field theme-violet">
          <label>{{ txt.violetLabel }}</label>
          <ng-jvx-multiselect [options]="fruits" [multi]="true" [value]="value" panelClass="theme-violet-panel">
            <span placeholder>{{ txt.violetLabel }}</span>
          </ng-jvx-multiselect>
        </div>
        <div class="demo-field theme-amber">
          <label>{{ txt.amberLabel }}</label>
          <ng-jvx-multiselect [options]="fruits" [multi]="true" [value]="value" panelClass="theme-amber-panel">
            <span placeholder>{{ txt.amberLabel }}</span>
          </ng-jvx-multiselect>
        </div>
      </div>
    </app-demo-section>
  `
})
export class ThemingExampleComponent {
  readonly fruits = FRUITS;
  readonly value: Fruit[] = [FRUITS[0], FRUITS[5]];

  readonly txt = t({
    en: {
      title: 'Theme and panelClass',
      description: `Colours are set with the <code>--jvx-multiselect-*</code> CSS variables, globally on
        <code>:root</code> or just on a container. The panel is rendered in an overlay attached to the
        <code>body</code>, so to theme it use <code>panelClass</code>, which adds a class to the overlay.`,
      defaultLabel: 'Default theme (:root)',
      violetLabel: 'Variables overridden on the container + panelClass',
      amberLabel: 'Another theme',
      fieldComment: 'the field: variables on the container',
      panelComment: 'the panel lives in the overlay: use panelClass'
    },
    it: {
      title: 'Tema e panelClass',
      description: `I colori si definiscono con le variabili CSS <code>--jvx-multiselect-*</code>, globalmente su
        <code>:root</code> o solo su un contenitore. Il pannello viene renderizzato in un overlay agganciato al
        <code>body</code>, quindi per tematizzarlo si usa <code>panelClass</code>, che aggiunge una classe
        all'overlay.`,
      defaultLabel: 'Tema predefinito (:root)',
      violetLabel: 'Variabili sovrascritte sul contenitore + panelClass',
      amberLabel: 'Altro tema',
      fieldComment: 'il campo: variabili sul contenitore',
      panelComment: 'il pannello vive nell\'overlay: si usa panelClass'
    }
  });

  readonly features = ['--jvx-multiselect-primary', '--jvx-multiselect-accent', '--jvx-multiselect-warn',
    '--jvx-multiselect-on-primary', '--jvx-multiselect-panel-bg', 'panelClass'];
  readonly code = [
    {
      label: 'styles.scss', content: `@use 'index' as ng-jvx-multiselect;

:root {
  --jvx-multiselect-primary: #2563eb;
  --jvx-multiselect-accent: #0ea5e9;
  --jvx-multiselect-warn: #dc2626;
  --jvx-multiselect-on-primary: #ffffff;
  --jvx-multiselect-on-accent: currentcolor;
  --jvx-multiselect-on-warn: currentcolor;
  --jvx-multiselect-panel-bg: #ffffff;
}

/* ${this.txt.fieldComment} */
.theme-violet {
  --jvx-multiselect-primary: #7c3aed;
  --jvx-multiselect-accent: #a855f7;
}

/* ${this.txt.panelComment} */
.theme-violet-panel {
  --jvx-multiselect-primary: #7c3aed;
  --jvx-multiselect-accent: #a855f7;
  --jvx-multiselect-panel-bg: #f5f3ff;
}`
    },
    {
      label: 'HTML', content: `<div class="theme-violet">
  <ng-jvx-multiselect [options]="fruits" [multi]="true" panelClass="theme-violet-panel">
  </ng-jvx-multiselect>
</div>`
    }
  ];
}
