# ng-jvx-multiselect

An Angular select for single and multiple selection, with static options or options loaded from a backend:
GET/POST requests, pagination with infinite scroll, client or server search, grouping, custom templates,
reactive/template-driven forms and validators.

> **Standalone components.** Import `NgJvxMultiselectComponent` and the directives you use directly in your
> component (or import `NgJvxMultiselectModule`, which exports all of them).

## Installation

```
npm install ng-jvx-multiselect --save
```

Peer dependencies: `@angular/core`, `@angular/common`, `@angular/forms`, `@angular/cdk` (>= 20) and `rxjs`.
For remote options provide the `HttpClient` (`provideHttpClient()`).

In **styles.scss** define the theme:

```scss
@use 'ng-jvx-multiselect';

:root {
  --jvx-multiselect-primary: #008000;
  --jvx-multiselect-accent: #0000ff;
  --jvx-multiselect-warn: #ff0000;
  --jvx-multiselect-on-primary: #ffffff;
  --jvx-multiselect-on-accent: currentcolor;
  --jvx-multiselect-on-warn: currentcolor;
  --jvx-multiselect-panel-bg: #ffffff;
}
```

## Quick start

```ts
import {NgJvxMultiselectComponent} from 'ng-jvx-multiselect';

@Component({
  imports: [NgJvxMultiselectComponent],
  template: `
    <ng-jvx-multiselect [options]="options" [(value)]="value">
      <span placeholder>Select an option</span>
    </ng-jvx-multiselect>
  `
})
export class ExampleComponent {
  options = [{value: 1, text: 'One'}, {value: 2, text: 'Two'}, {value: 3, text: 'Three'}];
  value = [this.options[0]];
}
```

The value is **always an array of options**, also in single selection.

![result](https://github.com/giovanni-venturelli/ng-jvx-multiselect/blob/main/blob/basic_usage.gif)

## API

### Inputs

| Name                     | Type                                                       | Default                                                                             | Description                                                                                                                |
|--------------------------|------------------------------------------------------------|-------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------|
| `options`                | `any[]`                                                    | `[]`                                                                                | Static options.                                                                                                            |
| `value`                  | `any[]`                                                    | `[]`                                                                                | Selected options. Supports `[(value)]`.                                                                                    |
| `multi`                  | `boolean`                                                  | `false`                                                                             | Multiple selection: selected options are shown as removable chips.                                                        |
| `itemValue`              | `string`                                                   | `'value'`                                                                           | Property used as key of the options.                                                                                       |
| `itemText`               | `string`                                                   | `'text'`                                                                            | Property used as label of the options.                                                                                     |
| `disabled`               | `boolean`                                                  | `false`                                                                             | Disables the select (with forms, use the control `disable()`).                                                             |
| `required`               | `boolean`                                                  | `false`                                                                             | Sets `aria-required`. Use `JvxMultiselectValidators.required` for validation.                                              |
| `clearable`              | `boolean`                                                  | `false`                                                                             | Shows a button that empties the selection.                                                                                 |
| `closeButton`            | `boolean`                                                  | `true`                                                                              | In multiple selection, shows the button that closes the panel.                                                             |
| `closeOnClick`           | `boolean`                                                  | `true`                                                                              | In single selection, closes the panel when an option is clicked.                                                          |
| `hasErrors`              | `boolean`                                                  | `false`                                                                             | Forces the error style.                                                                                                    |
| `panelClass`             | `string`                                                   | `''`                                                                                | Class added to the overlay panel (useful for theming, the panel is rendered in the `body`).                               |
| `groupBy`                | `string \| NgJvxGroupMapper<any> \| null`                  | `null`                                                                              | Groups the options by a property (dot paths supported) or through a mapper.                                                |
| `searchInput`            | `boolean`                                                  | `false`                                                                             | Shows the search input in the panel.                                                                                       |
| `searchMode`             | `'client' \| 'server' \| null`                             | `null`                                                                              | `'client'` filters the available options, `'server'` sends the search to the backend. `null`: server when `url` is set.  |
| `searchLabel`            | `string`                                                   | `'search'`                                                                          | Placeholder of the search input.                                                                                           |
| `searchMapper`           | `NgJvxSearchMapper<any>`                                   | match on `itemText`                                                                 | Client-side search logic.                                                                                                  |
| `url`                    | `string`                                                   | `''`                                                                                | Endpoint of the remote options. When set, options are loaded when the panel opens.                                         |
| `requestType`            | `'get' \| 'post'` (case-insensitive)                       | `'get'`                                                                             | HTTP verb of the remote request.                                                                                           |
| `requestHeaders`         | `HttpHeaders`                                              | `new HttpHeaders()`                                                                 | Headers of the remote request.                                                                                             |
| `postPayload`            | `object`                                                   | `undefined`                                                                         | Extra properties merged into the body of POST requests.                                                                    |
| `searchProp`             | `string`                                                   | `'search'`                                                                          | Name of the search parameter.                                                                                              |
| `listProp`               | `string`                                                   | `''`                                                                                | Where the list is in the response (dot paths supported, e.g. `'data.items'`). Empty: the response is the array.            |
| `pageSize`               | `number`                                                   | `15`                                                                                | Page size (minimum 15).                                                                                                    |
| `ignorePagination`       | `boolean`                                                  | `false`                                                                             | Loads everything with a single request.                                                                                    |
| `paginationProp`         | `{page: string, pageSize: string}`                         | `{page: 'page', pageSize: 'size'}`                                                  | Names of the pagination parameters of the request.                                                                         |
| `paginationResponseProp` | `string`                                                   | `'pagingInfo'`                                                                      | Where the pagination info is in the response (read only when `listProp` is set).                                           |
| `paginationResponse`     | `{currentPage: string, totalPages: string, totalRows: string}` | `{currentPage: 'pageNo', totalPages: 'pageCount', totalRows: 'totalRecordCount'}` | Names of the pagination properties of the response.                                                                       |
| `mapper`                 | `NgJvxOptionMapper<any>`                                   | identity                                                                            | Maps each received item to an option.                                                                                      |
| `multiMapper`            | `NgJvxMultiOptionMapper<any>`                              | identity                                                                            | Maps the whole response before the single items (e.g. to add custom options).                                             |

### Outputs

| Name                   | Payload   | Description                                       |
|------------------------|-----------|---------------------------------------------------|
| `valueChange`          | `any[]`   | The user changed the selection.                   |
| `jvxMultiselectOpen`   | –         | The panel starts opening.                         |
| `jvxMultiselectOpened` | –         | The panel is open.                                |
| `jvxMultiselectClose`  | –         | The panel starts closing.                         |
| `jvxMultiselectClosed` | –         | The panel is closed.                              |
| `scrollEnd`            | –         | The option list has been scrolled to the bottom.  |
| `loadError`            | `unknown` | A remote request failed (the error).              |

### Public members

Accessible through a template reference (`#select`) or `viewChild`:

| Member                                     | Description                                              |
|--------------------------------------------|----------------------------------------------------------|
| `openMenu()` / `closeMenu()`               | Opens / closes the panel.                                |
| `select(option)` / `deselect(option)`      | Changes the selection programmatically.                 |
| `clear()`                                  | Empties the selection.                                   |
| `isOpen()`, `isLoading()`                  | Signals with the panel and loading state.                |
| `totalRows()`, `totalPages()`              | Signals with the pagination info read from the response. |
| `value`, `selectableOptions`, `searchValue` | Current selection, options shown, applied search.       |

### Slots

| Slot              | Description                                                                         |
|-------------------|-------------------------------------------------------------------------------------|
| `[placeholder]`   | Shown when nothing is selected.                                                     |
| `[ng-jvx-footer]` | Footer of the panel.                                                                |
| default           | Static options declared as `<ng-jvx-option [value]="...">Label</ng-jvx-option>`.   |

Options declared in the default slot are selectable: a primitive `value` becomes
`{[itemValue]: value, [itemText]: <option text>}`, an object `value` is used as is.

## Remote options

```html
<ng-jvx-multiselect url="/api/options" listProp="data" [multi]="true"
                    [searchInput]="true" searchMode="server">
</ng-jvx-multiselect>
```

**GET**: search and pagination are query parameters: `GET /api/options?search=abc&page=1&size=15`.

**POST** (`requestType="post"`): they are sent in the body, merged with `postPayload`:

```json
{"search": "abc", "paging": {"sort": "", "ignorePagination": false, "page": "1", "size": "15"}, "...": "postPayload"}
```

**Response**: with `listProp="data"` and the default pagination names:

```json
{"data": [{"value": 1, "text": "One"}], "pagingInfo": {"pageNo": 1, "pageCount": 4, "totalRecordCount": 60}}
```

The next page is requested when the list is scrolled to the bottom, until `pageCount` is reached (or, without
pagination info, until an empty page is returned). Every request carries the `JVXMULTISELECT` HTTP context token:

```ts
import {JVXMULTISELECT} from 'ng-jvx-multiselect';

export const interceptor: HttpInterceptorFn = (req, next) =>
  req.context.get(JVXMULTISELECT) ? next(req.clone({setHeaders: {Authorization: token()}})) : next(req);
```

### Mappers

```ts
// each item: {id, description} -> {value, text}
mapper: NgJvxOptionMapper<Option> = {
  mapOption: (source: {id: number, description: string}) => of({value: source.id, text: source.description})
};

// whole response, before the single items (the array, or the response object when listProp is set)
multiMapper: NgJvxMultiOptionMapper<Option> = {
  mapOptions: (source: Option[]) => of([{value: 0, text: 'All'}, ...source])
};
```

## Search

`[searchInput]="true"` shows the search input. With `searchMode="client"` the available options are filtered
with the `searchMapper` (by default a case-insensitive match on `itemText`):

```ts
searchMapper: NgJvxSearchMapper<Option> = {
  mapSearch: (search: string, options: Option[]) => of(options.filter(o => o.text.toLowerCase().startsWith(search)))
};
```

With `searchMode="server"` (or `null` and an `url`) the text is sent as `searchProp` and the list restarts from the
first page.

## Groups

```html
<ng-jvx-multiselect [options]="options" groupBy="category">
  <div *ngJvxGroupHeader="let g">{{ g.group }} ({{ g.options.length }})</div>
</ng-jvx-multiselect>
```

`groupBy` can also be a `NgJvxGroupMapper`, for nested properties or computed groups:

```ts
byContinent: NgJvxGroupMapper<Country> = {
  mapGroup: (option: Country) => of({group: option.continent.name, option})
};
```

## Templates

| Directive                          | Context                                                              |
|------------------------------------|----------------------------------------------------------------------|
| `*ngJvxOptionsTemplate="let o"`    | The option to render.                                                |
| `*ngJvxSelectionTemplate="let v"`  | Multiple selection: the array of selected options. Single: the option. |
| `*ngJvxGroupHeader="let g"`        | `{group, options}`.                                                  |
| `[ngJvxDisabledOption]="boolean"`  | Placed in the option template, makes the option unselectable.        |

```html
<ng-jvx-multiselect [options]="fruits" [multi]="true">
  <div *ngJvxOptionsTemplate="let fruit" [ngJvxDisabledOption]="!fruit.available">
    {{ fruit.text }} <small>{{ fruit.category }}</small>
  </div>
  <ng-container *ngJvxSelectionTemplate="let selection">
    @for (fruit of selection; track fruit.value) {
      <ng-jvx-multiselect-chip [value]="fruit">{{ fruit.text }}</ng-jvx-multiselect-chip>
    }
  </ng-container>
</ng-jvx-multiselect>
```

### `<ng-jvx-multiselect-chip>`

A removable chip. Inside a multiselect, removing it deselects the option.

| Member     | Type      | Description                                   |
|------------|-----------|-----------------------------------------------|
| `value`    | input     | The option represented by the chip.           |
| `disabled` | input     | Hides the remove button.                      |
| `removed`  | output    | Emitted with `value` when the chip is removed. |

## Forms and validators

The component implements `ControlValueAccessor` (`formControlName`, `[formControl]`, `ngModel`). It gets the
`has-errors` class when the control is invalid and touched; the control is marked as touched when the panel closes
or the select loses focus.

```ts
import {JvxMultiselectValidators} from 'ng-jvx-multiselect';

tags = new FormControl([], [
  JvxMultiselectValidators.required,      // {required: true}
  JvxMultiselectValidators.minLength(2),  // {minSelectionLength: true}
  JvxMultiselectValidators.maxLength(5)   // {maxSelectionLength: true}
]);
```

## Theming

Colours come from the CSS variables shown in the installation section; they can be set globally or on a container.
The panel is rendered in an overlay attached to the `body`, so theme it through `panelClass`:

```scss
.violet-panel {
  --jvx-multiselect-primary: #7c3aed;
  --jvx-multiselect-panel-bg: #f5f3ff;
}
```

## Accessibility and keyboard

The trigger is a focusable `combobox` (`aria-expanded`, `aria-controls`, `aria-disabled`, `aria-invalid`);
the options are `role="option"` with `aria-selected`. `Enter`, `Space` and `ArrowDown` open the panel, `Escape`
closes it.
