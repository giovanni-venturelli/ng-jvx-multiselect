# ng-jvx-multiselect

A select component for Angular that handles both single and multiple selection. Options can be passed in
directly or loaded from a backend, with pagination, search, grouping and fully customisable templates.

![ng-jvx-multiselect in action](https://github.com/giovanni-venturelli/ng-jvx-multiselect/blob/main/blob/basic_usage.gif)

**Features**

- Single and multiple selection, with removable chips and an optional clear button
- Static options, declared in code or directly in the template
- Remote options over GET or POST, with infinite-scroll pagination
- Client-side or server-side search, with pluggable matching logic
- Grouping by property or by a custom rule
- Custom templates for options, selected values and group headers
- Works with reactive and template-driven forms, and ships with dedicated validators
- Themeable through CSS variables, keyboard-accessible and ARIA-annotated
- Standalone components with `OnPush` change detection and no extra runtime dependencies

## Contents

- [Installation](#installation)
- [Getting started](#getting-started)
- [Selection](#selection)
- [Declaring options in the template](#declaring-options-in-the-template)
- [Search](#search)
- [Groups](#groups)
- [Remote options](#remote-options)
- [Templates](#templates)
- [Forms and validation](#forms-and-validation)
- [Events](#events)
- [Controlling the component from code](#controlling-the-component-from-code)
- [Theming and styling](#theming-and-styling)
- [Accessibility](#accessibility)
- [API reference](#api-reference)
- [Upgrading from earlier 20.0.x versions](#upgrading-from-earlier-200x-versions)

## Installation

```
npm install ng-jvx-multiselect --save
```

**Requirements:** Angular 20 (`@angular/core`, `@angular/common`, `@angular/forms`, `@angular/cdk`) and `rxjs` 7.
If you load options from a backend, the application must also provide the `HttpClient`:

```ts
bootstrapApplication(AppComponent, {
  providers: [provideHttpClient()]
});
```

The component styles are bundled with the components, so there is nothing to import. Just define the theme
colours in your global stylesheet (e.g. `styles.scss`):

```scss
:root {
  --jvx-multiselect-primary: #2563eb;      // chips, selected and hovered options, close button
  --jvx-multiselect-on-primary: #ffffff;   // text and icons drawn on the primary colour
  --jvx-multiselect-accent: #0ea5e9;       // loading spinner, focus outline
  --jvx-multiselect-warn: #dc2626;         // error state
  --jvx-multiselect-panel-bg: #ffffff;     // background of the options panel
}
```

## Getting started

All the building blocks are standalone: import the component, and any directive you use, into the component
that needs them. If you prefer an NgModule, `NgJvxMultiselectModule` exports all of them.

```ts
import {Component} from '@angular/core';
import {NgJvxMultiselectComponent} from 'ng-jvx-multiselect';

@Component({
  selector: 'app-example',
  imports: [NgJvxMultiselectComponent],
  template: `
    <ng-jvx-multiselect [options]="options" [(value)]="value">
      <span placeholder>Select an option</span>
    </ng-jvx-multiselect>
  `
})
export class ExampleComponent {
  options = [
    {value: 1, text: 'One'},
    {value: 2, text: 'Two'},
    {value: 3, text: 'Three'}
  ];
  value = [this.options[0]];
}
```

The content marked with the `placeholder` attribute is shown while nothing is selected.

## Selection

### The value

The value is **always an array of options**, even in single selection, where it holds at most one item. It
supports two-way binding with `[(value)]`, or you can bind `[value]` and listen to `(valueChange)` separately.
Selections are compared by key, so assigning a new array with the same keys does not reset the component.

### Single and multiple selection

By default the component works as a single select: clicking an option selects it and closes the panel, while
clicking the selected option again clears it. Set `[closeOnClick]="false"` to keep the panel open after a choice.

With `[multi]="true"`, each click toggles an option and the panel stays open. The selected options are shown as
removable chips and are kept **sorted by key**. The panel closes when the user clicks outside it, presses
`Escape` or uses the close button, which can be hidden with `[closeButton]="false"`.

```html
<ng-jvx-multiselect [options]="fruits" [multi]="true" [clearable]="true" [(value)]="selected">
  <span placeholder>Pick one or more fruits</span>
</ng-jvx-multiselect>
```

`[clearable]="true"` adds a button that empties the selection.

### Custom keys

Options are expected to have `value` and `text` properties. If yours use other names, tell the component which
property identifies an option and which one is its label:

```html
<ng-jvx-multiselect [options]="countries" itemValue="code" itemText="name"></ng-jvx-multiselect>
```

## Declaring options in the template

Instead of passing an array, you can declare the options as `<ng-jvx-option>` elements inside the component:

```ts
import {NgJvxMultiselectComponent, NgJvxOptionComponent} from 'ng-jvx-multiselect';
```

```html
<ng-jvx-multiselect [multi]="true" [(value)]="sizes">
  <ng-jvx-option [value]="'S'">Small</ng-jvx-option>
  <ng-jvx-option [value]="'M'">Medium</ng-jvx-option>
  <ng-jvx-option [value]="'L'" [disabled]="true">Large (sold out)</ng-jvx-option>
</ng-jvx-multiselect>
```

When `value` is a primitive, the selected option is built as `{[itemValue]: value, [itemText]: <the option's
text>}`, so the example above produces values such as `{value: 'S', text: 'Small'}`. When `value` is an object, it
is used as it is.

## Search

`[searchInput]="true"` adds a search box at the top of the panel, focused as soon as the panel opens.
`searchLabel` sets its placeholder. The search runs 300 ms after the user stops typing and is cleared when the panel
closes.

`searchMode` decides where the search happens:

| `searchMode` | Behaviour                                                                                         |
|--------------|---------------------------------------------------------------------------------------------------|
| `'client'`   | Filters the options already available, static or loaded from the backend.                          |
| `'server'`   | Sends the text to the backend (as the `searchProp` parameter) and reloads from the first page.     |
| `null`       | The default: behaves like `'server'` when an `url` is set, and does not search otherwise.           |

By default the client-side search keeps the options whose `itemText` contains the text, ignoring case. Provide a
`searchMapper` to change the matching logic, for example to also match a code or to ignore accents:

```ts
import {NgJvxSearchMapper} from 'ng-jvx-multiselect';

countrySearch: NgJvxSearchMapper<Country> = {
  mapSearch: (search: string, options: Country[]) =>
    of(options.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.code === search.toUpperCase()))
};
```

```html
<ng-jvx-multiselect [options]="countries" itemValue="code" itemText="name"
                    [searchInput]="true" searchMode="client" [searchMapper]="countrySearch">
</ng-jvx-multiselect>
```

## Groups

`groupBy` splits the options into groups. Groups appear in the order in which they are first met in the list.
The simplest form is the name of a property, which can also be a dot-separated path:

```html
<ng-jvx-multiselect [options]="fruits" groupBy="category"></ng-jvx-multiselect>
```

For computed rules, pass an `NgJvxGroupMapper` that wraps each option together with the name of its group:

```ts
import {NgJvxGroupMapper} from 'ng-jvx-multiselect';

byContinent: NgJvxGroupMapper<Country> = {
  mapGroup: (option: Country) => of({group: option.continent.name, option})
};
```

To customise the group headers, see [`*ngJvxGroupHeader`](#group-headers).

## Remote options

Set `url` and the component loads the options from the backend every time the panel opens. While the first page
is loading, a spinner replaces the arrow; the panel opens as soon as the data arrives.

```html
<ng-jvx-multiselect url="/api/options" listProp="data" [multi]="true"
                    [searchInput]="true" searchMode="server">
</ng-jvx-multiselect>
```

### Requests

With the default `requestType="get"`, the search text and the pagination are sent as query parameters:

```
GET /api/options?search=abc&page=1&size=15
```

With `requestType="post"` they travel in the request body, merged with `postPayload`:

```json
{
  "search": "abc",
  "paging": {"sort": "", "ignorePagination": false, "page": "1", "size": "15"},
  "department": "sales"
}
```

- `requestHeaders` sets the request headers (an `HttpHeaders` instance).
- `postPayload` adds properties to the POST body, such as filters.
- `pageSize` sets the page size (minimum and default: 15).
- `searchProp` and `paginationProp` rename the parameters, e.g. `searchProp="q"` and
  `[paginationProp]="{page: 'pageNumber', pageSize: 'pageLength'}"`.
- `[ignorePagination]="true"` requests every option at once and omits the pagination parameters (on POST, only
  `paging: {sort: '', ignorePagination: true}` is sent).

### Responses and pagination

If the response is the array of options itself, leave `listProp` empty. Otherwise `listProp` points to the array
inside the response, and the component also reads the pagination info. With `listProp="data"` and the default
names, the expected response is:

```json
{
  "data": [{"value": 1, "text": "One"}, {"value": 2, "text": "Two"}],
  "pagingInfo": {"pageNo": 1, "pageCount": 4, "totalRecordCount": 60}
}
```

If your API uses different names, map them with `paginationResponseProp` and `paginationResponse`.
`listProp` and `paginationResponseProp` also accept dot-separated paths, such as `'result.items'`:

```html
<ng-jvx-multiselect url="/api/people" listProp="results"
                    paginationResponseProp="meta"
                    [paginationResponse]="{currentPage: 'current', totalPages: 'pages', totalRows: 'total'}">
</ng-jvx-multiselect>
```

When the user scrolls to the bottom of the list, the next page is requested and appended. Loading stops once the
last page reported by the backend has been loaded, or, if the response carries no pagination info, when an empty
page is returned. The totals read from the response are available as `totalRows()` and `totalPages()`.

### Mapping the response

`mapper` turns each item received from the backend into an option:

```ts
import {NgJvxOptionMapper} from 'ng-jvx-multiselect';

personMapper: NgJvxOptionMapper<Option> = {
  mapOption: (person: {id: number, firstName: string, lastName: string}) =>
    of({value: person.id, text: `${person.firstName} ${person.lastName}`})
};
```

`multiMapper` receives the whole response before the single items are extracted and mapped, which is handy for
adding custom options. Note that it receives the raw response: the array itself or, when `listProp` is set, the
response object.

```ts
import {NgJvxMultiOptionMapper} from 'ng-jvx-multiselect';

withAll: NgJvxMultiOptionMapper<Option> = {
  mapOptions: (options: Option[]) => of([{value: 0, text: 'All'}, ...options])
};
```

### Intercepting the requests

Every request sent by the library carries the `JVXMULTISELECT` HTTP context token, so an interceptor can tell
it apart from the rest of the application's traffic:

```ts
import {HttpInterceptorFn} from '@angular/common/http';
import {JVXMULTISELECT} from 'ng-jvx-multiselect';

export const authInterceptor: HttpInterceptorFn = (req, next) =>
  req.context.get(JVXMULTISELECT)
    ? next(req.clone({setHeaders: {Authorization: `Bearer ${getToken()}`}}))
    : next(req);
```

`setJvxCall()` returns an `HttpContext` with the token already set, should you need to send requests that
interceptors treat the same way.

### Errors

If a request fails, the component stops loading and emits the error through `(loadError)`, so you can show a
message or retry:

```html
<ng-jvx-multiselect url="/api/options" (loadError)="notifyError($event)"></ng-jvx-multiselect>
```

## Templates

### Options

`*ngJvxOptionsTemplate` defines how each option is rendered. Its context is the option:

```html
<ng-jvx-multiselect [options]="fruits">
  <div *ngJvxOptionsTemplate="let fruit" class="fruit-option">
    <span class="swatch" [style.background]="fruit.color"></span>
    {{ fruit.text }} <small>{{ fruit.kcal }} kcal</small>
  </div>
</ng-jvx-multiselect>
```

### Disabled options

Add `[ngJvxDisabledOption]` to the element of the option template to make an option unselectable. Disabled
options are dimmed and ignore clicks:

```html
<div *ngJvxOptionsTemplate="let fruit" [ngJvxDisabledOption]="!fruit.available">{{ fruit.text }}</div>
```

### Selected value

`*ngJvxSelectionTemplate` defines how the selection is shown. In multiple selection its context is the array of
selected options; in single selection it is the selected option.

`<ng-jvx-multiselect-chip>` is the chip used by default in multiple selection. You can reuse it in your own
template: inside a multiselect, removing a chip deselects its option.

```html
<ng-jvx-multiselect [options]="fruits" [multi]="true">
  <ng-container *ngJvxSelectionTemplate="let selection">
    @for (fruit of selection; track fruit.value) {
      <ng-jvx-multiselect-chip [value]="fruit">{{ fruit.text }}</ng-jvx-multiselect-chip>
    }
  </ng-container>
</ng-jvx-multiselect>
```

### Group headers

`*ngJvxGroupHeader` defines how group headers are rendered. Its context is the group, in the form
`{group, options}`:

```html
<ng-jvx-multiselect [options]="countries" [groupBy]="byContinent">
  <div *ngJvxGroupHeader="let g" class="group-header">{{ g.group }} ({{ g.options.length }})</div>
</ng-jvx-multiselect>
```

### Panel footer

Content marked with the `ng-jvx-footer` attribute is shown at the bottom of the panel, below the list:

```html
<ng-jvx-multiselect #select [options]="items" [multi]="true">
  <div ng-jvx-footer>
    {{ select.value.length }} selected
    <button type="button" (click)="select.closeMenu()">Done</button>
  </div>
</ng-jvx-multiselect>
```

## Forms and validation

The component implements `ControlValueAccessor`, so it works with `formControlName`, `[formControl]` and
`[(ngModel)]`. The form value is the same array of options as `value`, and disabling the control disables the
select.

`JvxMultiselectValidators` provides validators that count the selected items:

| Validator      | Error key            | Fails when                         |
|----------------|----------------------|------------------------------------|
| `required`     | `required`           | Nothing is selected.               |
| `minLength(n)` | `minSelectionLength` | Fewer than `n` items are selected. |
| `maxLength(n)` | `maxSelectionLength` | More than `n` items are selected.  |

```ts
import {JvxMultiselectValidators} from 'ng-jvx-multiselect';

form = new FormGroup({
  tags: new FormControl<Tag[]>([], [
    JvxMultiselectValidators.required,
    JvxMultiselectValidators.minLength(2),
    JvxMultiselectValidators.maxLength(5)
  ])
});
```

```html
<form [formGroup]="form">
  <ng-jvx-multiselect formControlName="tags" [options]="tags" [multi]="true"></ng-jvx-multiselect>
  @if (form.controls.tags.touched && form.controls.tags.errors; as errors) {
    @if (errors['required']) { <small>Select at least one tag.</small> }
    @if (errors['minSelectionLength']) { <small>Select at least 2 tags.</small> }
    @if (errors['maxSelectionLength']) { <small>Select up to 5 tags.</small> }
  }
</form>
```

The control is marked as touched when the panel closes or when the select loses focus. While the control is
invalid and touched, the component gets the `has-errors` class and `aria-invalid="true"`. To force the error
style regardless of the form state, use `[hasErrors]="true"`.

## Events

| Output                   | Emitted when                                                         |
|--------------------------|----------------------------------------------------------------------|
| `(valueChange)`          | The user changes the selection. The payload is the new value.        |
| `(jvxMultiselectOpen)`   | The panel starts opening.                                            |
| `(jvxMultiselectOpened)` | The panel has opened (after the animation).                          |
| `(jvxMultiselectClose)`  | The panel starts closing.                                            |
| `(jvxMultiselectClosed)` | The panel has closed (after the animation).                          |
| `(scrollEnd)`            | The list of options has been scrolled to the bottom.                 |
| `(loadError)`            | A request for remote options failed. The payload is the error.       |

`valueChange` is emitted when the selection changes through the UI or through `select()`, `deselect()` and
`clear()`. It is not emitted when the value is assigned through the `value` input or by the form control.

## Controlling the component from code

Get hold of the component through a template reference variable or a `viewChild` query to drive it from code:

```ts
readonly select = viewChild.required(NgJvxMultiselectComponent);

reset(): void {
  this.select().clear();
  this.select().closeMenu();
}
```

The most useful members are listed in the [API reference](#public-members).

## Theming and styling

### Colours

The colours come from the CSS variables listed under [Installation](#installation). Define them on `:root` for
the whole application, or on any container to theme only the selects inside it.

The options panel is rendered in an overlay attached to the end of the `body`, outside your containers. To
theme it, give it a class with `panelClass` and set the variables on that class:

```html
<div class="violet">
  <ng-jvx-multiselect [options]="fruits" panelClass="violet-panel"></ng-jvx-multiselect>
</div>
```

```scss
.violet, .violet-panel {
  --jvx-multiselect-primary: #7c3aed;
  --jvx-multiselect-accent: #a855f7;
}

.violet-panel {
  --jvx-multiselect-panel-bg: #f5f3ff;
}
```

### CSS classes

The component does not use view encapsulation, so its elements can be styled from your global stylesheet. These
classes are a good place to start:

| Class                                   | Element                                                       |
|-----------------------------------------|---------------------------------------------------------------|
| `ng-jvx-multiselect.has-errors`         | The component while its form control is invalid and touched.  |
| `ng-jvx-multiselect.floating`           | The component while it is focused, open or has a value.       |
| `.ng-jvx-multiselect-value-container`   | The clickable field; it also has `is-open` while open.        |
| `.ng-jvx-multiselect__placeholder`      | The placeholder.                                              |
| `.ng-jvx-multiselect-panel`             | The overlay panel (together with your `panelClass`).          |
| `.search-input-container`               | The search box.                                               |
| `.ng-jvx-option`                        | An option; it also has `ng-jvx-single-selected-option` when selected. |
| `.ng-jvx-disabled-option`               | An option disabled with `[ngJvxDisabledOption]`.              |
| `.ng-jvx-group-header`                  | The default group header.                                     |
| `.menu-footer`                          | The footer of the panel.                                      |
| `ng-jvx-multiselect-chip`               | A chip.                                                       |

## Accessibility

The field is a focusable element with `role="combobox"`. It exposes `aria-expanded`, `aria-controls`,
`aria-disabled`, `aria-required` and `aria-invalid`, and the list is a `listbox` of `option` elements with
`aria-selected`.

| Key                         | Action           |
|-----------------------------|------------------|
| `Enter`, `Space`, `↓`       | Opens the panel. |
| `Escape`                    | Closes the panel. |

The panel animation is disabled for users who prefer reduced motion.

## API reference

### `<ng-jvx-multiselect>` inputs

| Input                    | Type                                 | Default                                                                           | Description                                                                                   |
|--------------------------|--------------------------------------|-----------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------|
| `options`                | `any[]`                              | `[]`                                                                              | Static options.                                                                               |
| `value`                  | `any[]`                              | `[]`                                                                              | Selected options. Supports `[(value)]`.                                                       |
| `multi`                  | `boolean`                            | `false`                                                                           | Enables multiple selection.                                                                   |
| `itemValue`              | `string`                             | `'value'`                                                                         | Property that identifies an option.                                                           |
| `itemText`               | `string`                             | `'text'`                                                                          | Property used as the option label.                                                            |
| `disabled`               | `boolean`                            | `false`                                                                           | Disables the select. With forms, disable the control instead.                                 |
| `required`               | `boolean`                            | `false`                                                                           | Sets `aria-required`. For validation, use `JvxMultiselectValidators.required`.                |
| `clearable`              | `boolean`                            | `false`                                                                           | Shows a button that empties the selection.                                                    |
| `closeButton`            | `boolean`                            | `true`                                                                            | In multiple selection, shows a button that closes the panel.                                  |
| `closeOnClick`           | `boolean`                            | `true`                                                                            | In single selection, closes the panel when an option is clicked.                              |
| `hasErrors`              | `boolean`                            | `false`                                                                           | Forces the error style.                                                                       |
| `panelClass`             | `string`                             | `''`                                                                              | Class added to the overlay panel.                                                             |
| `groupBy`                | `string \| NgJvxGroupMapper \| null` | `null`                                                                            | Groups the options by a property (or path) or through a mapper.                               |
| `searchInput`            | `boolean`                            | `false`                                                                           | Shows the search box.                                                                         |
| `searchMode`             | `'client' \| 'server' \| null`       | `null`                                                                            | Where the search happens. See [Search](#search).                                              |
| `searchLabel`            | `string`                             | `'search'`                                                                        | Placeholder of the search box.                                                                |
| `searchMapper`           | `NgJvxSearchMapper`                  | match on `itemText`                                                               | Matching logic of the client-side search.                                                     |
| `url`                    | `string`                             | `''`                                                                              | Endpoint that provides the options.                                                           |
| `requestType`            | `'get' \| 'post'`                    | `'get'`                                                                           | HTTP method of the requests. Case-insensitive.                                                |
| `requestHeaders`         | `HttpHeaders`                        | `new HttpHeaders()`                                                               | Headers of the requests.                                                                      |
| `postPayload`            | `object`                             | `undefined`                                                                       | Properties added to the body of POST requests.                                                |
| `searchProp`             | `string`                             | `'search'`                                                                        | Name of the search parameter.                                                                 |
| `pageSize`               | `number`                             | `15`                                                                              | Page size. Values below 15 are raised to 15.                                                  |
| `ignorePagination`       | `boolean`                            | `false`                                                                           | Loads all the options with a single request.                                                  |
| `paginationProp`         | `NgJvxPaginationProp`                | `{page: 'page', pageSize: 'size'}`                                                | Names of the pagination parameters.                                                           |
| `listProp`               | `string`                             | `''`                                                                              | Property (or path) of the response that holds the options. Empty: the response is the array. |
| `paginationResponseProp` | `string`                             | `'pagingInfo'`                                                                    | Property (or path) of the response that holds the pagination info.                            |
| `paginationResponse`     | `NgJvxPaginationResponse`            | `{currentPage: 'pageNo', totalPages: 'pageCount', totalRows: 'totalRecordCount'}` | Names of the pagination properties in the response.                                           |
| `mapper`                 | `NgJvxOptionMapper`                  | identity                                                                          | Turns each item received from the backend into an option.                                     |
| `multiMapper`            | `NgJvxMultiOptionMapper`             | identity                                                                          | Transforms the whole response before the items are mapped.                                    |

### `<ng-jvx-multiselect>` outputs

See [Events](#events).

### `<ng-jvx-multiselect>` content

| Content                        | Description                                                     |
|--------------------------------|-----------------------------------------------------------------|
| `[placeholder]`                | Shown while nothing is selected.                                |
| `[ng-jvx-footer]`              | Footer of the panel.                                            |
| `<ng-jvx-option>`              | Options declared in the template.                               |
| `*ngJvxOptionsTemplate`        | Template of the options.                                        |
| `*ngJvxSelectionTemplate`      | Template of the selected value.                                 |
| `*ngJvxGroupHeader`            | Template of the group headers.                                  |

### Public members

| Member                                     | Description                                                            |
|--------------------------------------------|------------------------------------------------------------------------|
| `openMenu()`                               | Opens the panel, loading the first page first when `url` is set.       |
| `closeMenu()`                              | Closes the panel.                                                      |
| `select(option)`, `deselect(option)`       | Adds or removes an option, emitting `valueChange`.                     |
| `clear()`                                  | Empties the selection, emitting `valueChange`.                         |
| `isOptionSelected(option)`                 | Whether an option is selected.                                         |
| `value`                                    | The current selection.                                                 |
| `selectableOptions`                        | The options currently shown in the panel.                              |
| `orderedOptions`                           | The same options split into groups, when `groupBy` is set.             |
| `searchValue`                              | The search text currently applied.                                     |
| `isOpen()`, `isLoading()`, `disabledState()` | Signals with the state of the panel, of the loading and of the select. |
| `totalRows()`, `totalPages()`              | Signals with the totals read from the last response.                   |
| `currentPage`                              | The last page loaded from the backend.                                 |
| `errorState`                               | Whether the form control is invalid and touched.                       |

### `<ng-jvx-option>`

| Member           | Kind   | Description                                       |
|------------------|--------|---------------------------------------------------|
| `value`          | input  | The value of the option.                          |
| `disabled`       | input  | Makes the option unselectable.                    |
| `isSelected`     | input  | Forces the selected style.                        |
| `clickOnOption`  | output | Emitted with `value` when the option is clicked.  |

### `<ng-jvx-multiselect-chip>`

| Member     | Kind   | Description                                                            |
|------------|--------|------------------------------------------------------------------------|
| `value`    | input  | The option the chip represents.                                        |
| `disabled` | input  | Hides the remove button. Chips are also disabled with their select.    |
| `removed`  | output | Emitted with `value` when the chip is removed.                         |

### Directives

| Directive                  | Context / input                                                           |
|----------------------------|---------------------------------------------------------------------------|
| `*ngJvxOptionsTemplate`    | The option (`NgJvxOptionsTemplateContext`).                               |
| `*ngJvxSelectionTemplate`  | The selected options or option (`NgJvxSelectionTemplateContext`).         |
| `*ngJvxGroupHeader`        | The group, as `{group, options}` (`NgJvxGroupHeaderContext`).             |
| `[ngJvxDisabledOption]`    | `boolean`: disables the option it is applied to.                          |

### Other exports

| Export                                                      | Description                                                         |
|-------------------------------------------------------------|---------------------------------------------------------------------|
| `NgJvxMultiselectModule`                                    | NgModule exporting all the components and directives.               |
| `JvxMultiselectValidators`                                  | `required`, `minLength(n)`, `maxLength(n)`.                         |
| `JVXMULTISELECT`, `setJvxCall()`                            | HTTP context token of the library requests, and a helper to set it. |
| `NgJvxMultiselectService`                                   | Service that performs the requests (`getList(request)`).            |
| `NgJvxOptionMapper`, `NgJvxMultiOptionMapper`               | Interfaces of `mapper` and `multiMapper`.                           |
| `NgJvxSearchMapper`                                         | Interface of `searchMapper`.                                        |
| `NgJvxGroupMapper`, `NgJvxGroup`, `NgJvxOptionGroup`        | Grouping interfaces.                                                |
| `NgJvxPaginationProp`, `NgJvxPaginationResponse`            | Types of `paginationProp` and `paginationResponse`.                 |
| `NgJvxRequestType`, `NgJvxSearchMode`, `NgJvxListRequest`   | Types of `requestType`, `searchMode` and of a service request.      |

## Upgrading from earlier 20.0.x versions

The public API is unchanged, but a few behaviours have been fixed or improved:

- `BrowserAnimationsModule` / `provideAnimations()` is no longer required, and `ngx-scrollbar` is no longer a
  dependency. The list now uses native scrolling with a thin scrollbar.
- With `searchMode="client"` and an `url`, the search filters the options already loaded instead of sending
  a new request.
- In single selection, clicks on the panel footer no longer close the panel.
- The form control is also marked as touched when the select loses focus.
- `close`/`closed` are no longer emitted when the window is resized while the panel is closed, and `opened` is
  emitted right after the opening animation.
- `<ng-jvx-option>` elements declared in the template are now selectable, and the chip emits `removed`.
- The `--jvx-multiselect-on-accent` and `--jvx-multiselect-on-warn` variables are no longer used; you can
  remove them from your theme.

## License

MIT
