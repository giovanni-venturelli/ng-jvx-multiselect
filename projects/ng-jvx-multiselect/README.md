# NgJvxMultiselect

ng-jvx-multiselect is a select based on angular material. It handles both single and multiple selections and allows to
retrieves the options via asynchronous calls.

## Install ng-jvx-multiselect

```
npm install ng-jvx-multiselect --save
```

In <b>app.module.ts</b>

```typescript
import {NgJvxMultiselectModule} from 'ng-jvx-multiselect';

@NgModule({
  imports: [
    NgJvxMultiselectModule
  ]
})
```

In <b>styles.scss</b>

```scss
@import '~@angular/material/theming';
@import '~ng-jvx-multiselect/ng-jvx-multiselect';
// Plus imports for other components in your app.

// Include the common styles for Angular Material.
@include mat-core();

// Define the palettes for your theme using the Material Design palettes available in palette.scss
// (imported above). 
$candy-app-primary: mat-palette($mat-indigo);
$candy-app-accent: mat-palette($mat-pink, A200, A100, A400);

// The warn palette is optional (defaults to red).
$candy-app-warn: mat-palette($mat-red);

// Create the theme object. A theme consists of configurations for individual
// theming systems such as `color` or `typography`.
$candy-app-theme: mat-light-theme((
  color: (
    primary: $candy-app-primary,
    accent: $candy-app-accent,
    warn: $candy-app-warn,
  )
));

@include angular-material-theme($candy-app-theme);
@include ng-jvx-multiselect-style($candy-app-theme);
```

## API

### Slots

| Name           | Description
| -------------- | -----------
| `default`      | Using the default slot is one way of defining the options via the component `<ng-jvx-option>`.
| `placeholder`  | This slot allows the user to define a placeholder which will be displayed when no selection has been made.

### Inputs

| Name             | Type                           | Default    | Description
|------------------|--------------------------------|------------| ---------------------------------------------------------------------------
| `clearable`      | `Boolean`                      | `false`    | True to enable the empty selection.
| `disabled`       | `Boolean`                      | `false`    | True to disable the select.
| `itemText`       | `String`                       | `'text'`   | The name of the property of the option object that will be displayed as description of the options.
| `itemValue`      | `String`                       | `'value'`  | The name of the property of the option object that will be treated as value of the options.
| `multi`          | `Boolean`                      | `false`    | True if it's a multiselect.
| `options`        | `Array`                        | `[]`       | Array of option objects.
| `requestHeaders` | `Object`                       | `{...}`    | The headers of the HTTP request.
| `requestType`    | <code>'GET'&#124;'POST'</code> | `'GET'`    | The type of the HTTP request.
| `searchInput`    | `Boolean`                      | `false`    | True to enable the search input for the options list.
| `searchLabel`    | `String`                       | `'search'` | The label of the search input.
| `searchProp`     | `String`                       | `'search'` | The name of the search property of the HTTP request.
| `listProp`       | `String`                       | `''`       | Name of the property in response.data where the list is stored.
| `url`            | `String`                       | `''`       | The url to get the options.
| `value`          | `Array`                        | `[]`       | The current value of the selection.
| `mapper`         | `NgJvxOptionMapper`            | `*`        | The object that will map the response of the async call.
| `searchMapper`   | `NgJvxSearchMapper`            | `*`        | The object that will map the client search result.
| `groupBy`        | `any`                          | `null`     | If set it defines the the property of each option by which group them in the list.

### Methods

*None*

### Events

| Event Name            | Detail  | Description
| --------------------- | ------- | -----------
| `valueChange`         | `Array` | Fired when the user changes the value of the input. The detail contains the value of the selection.
| `scrollEnd`           | *None*  | Fired when the scrollbar in the options menu reaches the bottom.
| `open`                | *None*  | Fired when the the menu starts opening.
| `opened`              | *None*  | Fired when the the menu is opened.
| `close`               | *None*  | Fired when the the menu starts closing.
| `closed`              | *None*  | Fired when the the menu is closed.

### HTTP Request

#### Request

The HTTP request can be either a GET or a POST request. The user can set the type using the property `requestType` which
is set to `'GET'` by default.

##### Headers

The headers can be set in the property `requestHeaders`. By default the ng-jvx-multiselect uses the property `trusted`
stored in the sessionStorage. The default headers are:

```javascript
var requestHeaders = {
  'Accept': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, OPTIONS',
  'Content-Type': 'application/json',
  'Authorization': window.sessionStorage.getItem('trusted')
}
```

#### Response

The response must contain an array of elements.

The property `listProp` defines the path of the array in the response object (i.e. if `listProp` is set to `list` the
ng-jvx-multiselect will get the options in the array stored in the path `response.list`).

#### Mapper

The `mapper` property will be an object implementing the interface `NgJvxOptionMapper<T>`. It will expose a
method `mapOption` which accepts the option to be mapped in the form of an Object and returns an Observable of type `T`.
For example if the request returns an array of objects like this:

```javascript
{
  id: number;
  description: string;
}
```

it is possible to write a mapper like this:

```javascript
 const mapper: NgJvxOptionMapper<{value: number, text: string}> = {
  mapOption(source: {
    id: number,
    description: string
  }): Observable<any> {
    return of({value: source.id, text: source.description});
  }
}
```
#### Search

If the property `searchInput` is on true, the user will be able to search a value amongst the options.
`searchProp` defines the name of the property for the HTTP call.

##### searchMapper

The `searchMapper` property is an object implementing the interface `NgJvxSearchMapper<T>`. It exposes the
method `mapSearch` which accepts the value of the search (a string) and returns an Observable of type `T[]`. 
The value of the returned Observable will then be used as the new option list.
This property is only useful for a client side search.

### Slots

#### default

The default slot allows to define the options directly via html. It's not compatible with the `url` parameter. The
options shall be wrapped in the `<ng-jvx-option>` component. The slot shall not be wrapped in the `<ng-jvx-option>`
component if it's decorated with one of the available directives, since it will have different purposes.

#### placeholder

The slot `placeholder` will define the placeholder. It's shown only when the selection's value is empty.

### Directive

#### *ngJvxOptionsTemplate

When an element inside the `ng-jvx-multiselect` is decorated with this directive it becomes the template for the options
of the select. The directive provides a context. i.e.: Let's say we have the following structure:

```javascript
var options = [{
  value: 1,
  text: 'Lorem ipsum',
  color: 'blue',
  preview: 'path/to/first-image.jpg'
},
  {
    value: 2,
    text: 'dolor sit amet',
    color: 'red',
    preview: 'path/to/second-image.jpg'
  }];
```

and we want our options to have in the text field both the property color and the property text. We can write the
template like so:

```angular2html

<div *ngJvxOptionsTemplate="let option">{{option.color}} {{option.text}}</div>
```

It's possible to use the context inside attributes too. i.e.

```angular2html

<div *ngJvxOptionsTemplate="let option">
  <span>{{option.text}}</span>
  <span>
        <img src="{{option.preview}}"/>
    </span>
</div>
```

#### *ngJvxSelectionTemplate

This directive works exactly as the `ngJvxOptionsTemplate` except it defines the selection template.  
In case of a multiple selection the context is the array of the selected options, for the non-multiple selection the
context is the selected option.

#### *ngJvxGroupHeaderTemplate

When an element inside the `ng-jvx-multiselect` is decorated with this directive it becomes the template for the header
of the groups by which the options are devided. The directive provides a context which describes the group with its
options in the following form:

```typescript
{
  group: any;
  options: any[];
}
```

i.e.: with the following structure:

```typescript
const options = [{
  value: 'dog',
  text: 'the dog',
  type: 'mammal'
}, {
  value: 'lizard',
  text: 'the lizard',
  type: 'reptile'
}, {
  value: 'cat',
  text: 'the cat',
  type: 'mammal'
  }];
```

and we want the header of each group be in the form of 'Type of animal: [mammal | reptile]'. We'll do as follows:

```angular2html

<div *ngJvxGroupHeaderTemplate="let g">Type of animal: {{g.group}}</div>
```

#### ngJvxDisabledOption

This directive disables the selection of the host option. i.e.

```angular2html

<div *ngJvxOptionsTemplate="let option" [ngJvxDisabledOption]="option.text === 'text of the disabled option'">
  <span>{{option.text}}</span>
  <span>
        <img src="{{option.preview}}"/>
    </span>
</div>
```
