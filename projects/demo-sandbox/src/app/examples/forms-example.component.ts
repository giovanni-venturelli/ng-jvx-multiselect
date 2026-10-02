import {Component, inject} from '@angular/core';
import {JsonPipe} from '@angular/common';
import {FormBuilder, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {JvxMultiselectValidators, NgJvxMultiselectComponent} from 'ng-jvx-multiselect';
import {DemoSectionComponent} from '../shared/demo-section.component';
import {EventLogService} from '../shared/event-log.service';
import {t} from '../shared/i18n';
import {COUNTRIES, Country, FRUITS, Fruit} from '../shared/sample-data';

@Component({
  selector: 'app-forms-example',
  imports: [NgJvxMultiselectComponent, DemoSectionComponent, ReactiveFormsModule, FormsModule, JsonPipe],
  template: `
    <app-demo-section anchor="forms" [title]="txt.title" [description]="txt.description" [features]="features" [code]="code">
      <form [formGroup]="form" (ngSubmit)="submit()" class="demo-form">
        <div class="demo-field">
          <label>{{ txt.fruitLabel }} *</label>
          <ng-jvx-multiselect formControlName="fruits" [options]="fruits" [multi]="true" [clearable]="true">
            <span placeholder>{{ txt.fruitPlaceholder }}</span>
          </ng-jvx-multiselect>
          @if (form.controls.fruits.touched && form.controls.fruits.errors; as errors) {
            <div class="errors">
              @if (errors['required']) { <small>{{ txt.required }}</small> }
              @if (errors['minSelectionLength']) { <small>{{ txt.min }}</small> }
              @if (errors['maxSelectionLength']) { <small>{{ txt.max }}</small> }
            </div>
          }
        </div>

        <div class="demo-field">
          <label>{{ txt.countryLabel }} *</label>
          <ng-jvx-multiselect formControlName="country" [options]="countries" itemValue="code" itemText="name"
                              [searchInput]="true" searchMode="client" [searchLabel]="txt.search">
            <span placeholder>{{ txt.countryPlaceholder }}</span>
          </ng-jvx-multiselect>
          @if (form.controls.country.touched && form.controls.country.hasError('required')) {
            <div class="errors"><small>{{ txt.countryRequired }}</small></div>
          }
        </div>

        <div class="demo-controls">
          <button type="submit">{{ txt.submit }}</button>
          <button type="button" (click)="form.markAllAsTouched()">markAllAsTouched</button>
          <button type="button" (click)="toggleDisabled()">{{ form.disabled ? 'enable()' : 'disable()' }}</button>
          <button type="button" (click)="form.reset({fruits: [], country: []})">reset()</button>
          <button type="button" (click)="patch()">patchValue()</button>
        </div>
        <pre class="demo-output">valid = {{ form.valid }}  status = {{ form.status }}
value = {{ summary() | json }}</pre>
      </form>

      <h3>{{ txt.templateDriven }}</h3>
      <div class="demo-field">
        <label>{{ txt.favouritesLabel }}</label>
        <ng-jvx-multiselect [(ngModel)]="favourites" name="favourites" [options]="countries" itemValue="code"
                            itemText="name" [multi]="true">
          <span placeholder>{{ txt.favouritesLabel }}</span>
        </ng-jvx-multiselect>
      </div>
      <pre class="demo-output">ngModel = {{ favouriteCodes() | json }}</pre>
    </app-demo-section>
  `
})
export class FormsExampleComponent {
  private readonly fb = inject(FormBuilder);
  private readonly log = inject(EventLogService);
  readonly fruits = FRUITS;
  readonly countries = COUNTRIES;
  favourites: Country[] = [COUNTRIES[11]];

  readonly txt = t({
    en: {
      title: 'Forms and validators',
      description: `The component implements <code>ControlValueAccessor</code>: it works with
        <code>formControlName</code>, <code>[formControl]</code> and <code>ngModel</code>.
        <code>JvxMultiselectValidators</code> provides <code>required</code>, <code>minLength(n)</code> and
        <code>maxLength(n)</code>, which count the selected items. When the control is invalid and touched the
        component gets the <code>has-errors</code> class.`,
      fruitLabel: 'Fruit (2 to 4)',
      fruitPlaceholder: 'Pick 2 to 4 fruits',
      required: 'Select at least one fruit.',
      min: 'Select at least 2 fruits.',
      max: 'You can select up to 4 fruits.',
      countryLabel: 'Country',
      countryPlaceholder: 'Country of residence',
      countryRequired: 'Country is required.',
      search: 'search',
      submit: 'Submit',
      templateDriven: 'Template-driven with ngModel',
      favouritesLabel: 'Favourite countries',
      validSubmit: 'valid submit',
      invalidSubmit: 'invalid submit'
    },
    it: {
      title: 'Form e validatori',
      description: `Il componente implementa <code>ControlValueAccessor</code>: funziona con <code>formControlName</code>,
        <code>[formControl]</code> e <code>ngModel</code>. <code>JvxMultiselectValidators</code> offre
        <code>required</code>, <code>minLength(n)</code> e <code>maxLength(n)</code>, che contano gli elementi
        selezionati. Quando il controllo è invalido e "touched" il componente riceve la classe <code>has-errors</code>.`,
      fruitLabel: 'Frutta (da 2 a 4)',
      fruitPlaceholder: 'Scegli da 2 a 4 frutti',
      required: 'Seleziona almeno un frutto.',
      min: 'Seleziona almeno 2 frutti.',
      max: 'Puoi selezionare al massimo 4 frutti.',
      countryLabel: 'Paese',
      countryPlaceholder: 'Paese di residenza',
      countryRequired: 'Il paese è obbligatorio.',
      search: 'cerca',
      submit: 'Invia',
      templateDriven: 'Template-driven con ngModel',
      favouritesLabel: 'Paesi preferiti',
      validSubmit: 'submit valido',
      invalidSubmit: 'submit non valido'
    }
  });

  readonly form = this.fb.group({
    fruits: this.fb.control<Fruit[]>([], [
      JvxMultiselectValidators.required,
      JvxMultiselectValidators.minLength(2),
      JvxMultiselectValidators.maxLength(4)
    ]),
    country: this.fb.control<Country[]>([], JvxMultiselectValidators.required)
  });

  summary(): unknown {
    const v = this.form.getRawValue();
    return {fruits: (v.fruits ?? []).map(f => f.text), country: (v.country ?? []).map(c => c.code)};
  }

  favouriteCodes(): string[] {
    return (this.favourites ?? []).map(c => c.code);
  }

  toggleDisabled(): void {
    this.form.disabled ? this.form.enable() : this.form.disable();
  }

  patch(): void {
    this.form.patchValue({fruits: [FRUITS[1], FRUITS[4], FRUITS[7]], country: [COUNTRIES[0]]});
  }

  submit(): void {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      this.log.event('form', this.txt.validSubmit, this.summary());
    } else {
      this.log.event('form', this.txt.invalidSubmit, {
        fruits: this.form.controls.fruits.errors,
        country: this.form.controls.country.errors
      });
    }
  }

  readonly features = ['formControlName', '[(ngModel)]', 'JvxMultiselectValidators', 'disable()', 'has-errors'];
  readonly code = [
    {
      label: 'TS', content: `import {JvxMultiselectValidators} from 'ng-jvx-multiselect';

form = this.fb.group({
  fruits: this.fb.control<Fruit[]>([], [
    JvxMultiselectValidators.required,
    JvxMultiselectValidators.minLength(2),
    JvxMultiselectValidators.maxLength(4)
  ]),
  country: this.fb.control<Country[]>([], JvxMultiselectValidators.required)
});`
    },
    {
      label: 'HTML', content: `<form [formGroup]="form">
  <ng-jvx-multiselect formControlName="fruits" [options]="fruits" [multi]="true">
  </ng-jvx-multiselect>
  @if (form.controls.fruits.touched && form.controls.fruits.errors; as errors) {
    @if (errors['required']) { <small>${this.txt.required}</small> }
    @if (errors['minSelectionLength']) { <small>${this.txt.min}</small> }
    @if (errors['maxSelectionLength']) { <small>${this.txt.max}</small> }
  }
</form>

<!-- template-driven -->
<ng-jvx-multiselect [(ngModel)]="favourites" [options]="countries"
                    itemValue="code" itemText="name" [multi]="true">
</ng-jvx-multiselect>`
    },
    {
      label: 'SCSS', content: `// class set by the component when the control is invalid && touched
ng-jvx-multiselect.has-errors .ng-jvx-multiselect {
  border-color: var(--jvx-multiselect-warn);
}`
    }
  ];
}
