# NgJvxMultiselectWorkspace

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 11.2.6.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.


# NgJvxMultiselectWorkspace

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 11.2.6.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

---

## API

Inputs
- `value: any` (InputSignal): The value represented by the chip. Use property binding: `[value]="item"`.
- `disabled: boolean` (InputSignal, default `false`): Disables the chip interaction (prevents removal). Bind via `[disabled]="isDisabled"`.

Outputs
- `removed: EventEmitter<any>`: Emitted when the user clicks the chip remove icon and the chip is not disabled. The event payload is the `value` of the chip.

## Template structure

The chip projects its content and renders a remove button:
- Projected content displays the text/markup (e.g., item label).
- A remove icon on the right triggers `removed` when clicked.

The component adds a `disabled` CSS class when disabled.

## Usage

Most commonly, chips are rendered by the multiselect’s default multi-selection template. Example (simplified):

```html
<ng-jvx-multiselect ... [multi]="true">
  <!-- The default template internally uses ng-jvx-multiselect-chip -->
</ng-jvx-multiselect>
```

If you provide a custom selection template, you can explicitly use the chip component. The multiselect wires the `removed` output to deselect values automatically, so emitting `removed` will remove the item from selection.

Example custom selection template inside `ng-jvx-multiselect`:

```html
<ng-jvx-multiselect [multi]="true" [value]="selectedItems">
  <ng-template ngJvxSelectionTemplate let-value>
    <div style="display:flex; gap:.3rem; flex-wrap:wrap;">
      <ng-container *ngFor="let val of value; trackBy: trackById">
        <ng-jvx-multiselect-chip
          class="ng-jvx-multiselect-chip"
          [value]="val"
          [disabled]="isDisabled">
          {{ val[itemText] }}
        </ng-jvx-multiselect-chip>
      </ng-container>
    </div>
  </ng-template>
</ng-jvx-multiselect>
```

Notes
- Do not try to set `chip.disabled` programmatically from TypeScript by assigning or calling methods on the InputSignal. Always bind `[disabled]` in the template.
- When used inside the multiselect component, the library already subscribes to `removed` and deselects the item. If you use the chip elsewhere, handle `(removed)` yourself, e.g., `(removed)="onChipRemoved($event)"`.

## Styling

You can target the chip in CSS using the selector or a class:
- Host selector: `ng-jvx-multiselect-chip`
- Example class applied in templates: `.ng-jvx-multiselect-chip`
- The component toggles the `disabled` class when `[disabled]` is true.

Example CSS snippet:
```css
.ng-jvx-multiselect-chip { /* your chip styles */ }
.ng-jvx-multiselect-chip.disabled { opacity: .5; pointer-events: none; }
```

## Accessibility

- The remove button is clickable and stops propagation to avoid opening/closing the dropdown accidentally.
- Ensure sufficient color contrast for the chip and provide focus styles if you enable keyboard interactions around the chip container.
