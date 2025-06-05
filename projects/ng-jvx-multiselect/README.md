# NgJvxMultiselect

ng-jvx-multiselect is a select based on angular. It handles both single and multiple selections and allows to
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
@use 'index' as ng-jvx-multiselect;

:root {
  --jvx-multiselect-primary: #008000;
  --jvx-multiselect-accent: #0000FF;
  --jvx-multiselect-warn: #FF0000;
  --jvx-multiselect-on-primary: #ffffff;
  --jvx-multiselect-on-accent: currentcolor;
  --jvx-multiselect-on-warn: currentcolor;
  --jvx-multiselect-panel-bg: #FFFFFF
}
```
In <b>example.component.html</b>

```angular2html
<ng-jvx-multiselect style="width: 100%" [options]="options">
  <ng-container placeholder>
    this is a placeholder
  </ng-container>
</ng-jvx-multiselect>
```
In <b>example.component.ts</b>

```typescript
  public options = [
    {value: 1, text: 'text 1'},
    {value: 2, text: 'text 2'},
    {value: 3, text: 'text 3'},
    {value: 4, text: 'text 4'},
    {value: 5, text: 'text 5'},
    {value: 6, text: 'text 6'},
    {value: 7, text: 'text 7'},
    {value: 8, text: 'text 8'},
    {value: 9, text: 'text 9'},
    {value: 10, text: 'text 10'}];
```
![result](https://github.com/giovanni-venturelli/ng-jvx-multiselect/blob/main/blob/basic_usage.gif)

## API

### Slots

| Name          | Description                                                                                                |
|---------------|------------------------------------------------------------------------------------------------------------|
| `default`     | Using the default slot is one way of defining the options via the component `<ng-jvx-option>`.             |
| `placeholder` | This slot allows the user to define a placeholder which will be displayed when no selection has been made. |

### Inputs

| Name             | Type                                                     | Default    | Description                                                                                                                                                                                            |
|------------------|----------------------------------------------------------|------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `clearable`      | `Boolean`                                                | `false`    | True to enable the empty selection.                                                                                                                                                                    |
| `closeButton`    | `Boolean`                                                | `false`    | True to show the button that closes the menu.                                                                                                                                                          |
| `disabled`       | `Boolean`                                                | `false`    | True to disable the select.                                                                                                                                                                            |
| `itemText`       | `String`                                                 | `'text'`   | The name of the property of the option object that will be displayed as description of the options.                                                                                                    |
| `itemValue`      | `String`                                                 | `'value'`  | The name of the property of the option object that will be treated as value of the options.                                                                                                            |
| `multi`          | `Boolean`                                                | `false`    | True if it's a multiselect.                                                                                                                                                                            |
| `options`        | `Array`                                                  | `[]`       | Array of option objects.                                                                                                                                                                               |
| `requestHeaders` | `Object`                                                 | `{...}`    | The headers of the HTTP request.                                                                                                                                                                       |
| `requestType`    | <code>'GET'&#124;'POST'</code>                           | `'GET'`    | The type of the HTTP request.                                                                                                                                                                          |
| `postPayload`    | `Object`                                                 | {}         | Sets the payload for the post request.                                                                                                                                                                 |
| `searchInput`    | `Boolean`                                                | `false`    | True to enable the search input for the options list.                                                                                                                                                  |
| `searchMode`     | <code>'client'&#124;'server'</code>                      | `server`   | `'client'` if the search is only client side, `'server'` if it's server side.                                                                                                                          |
| `searchLabel`    | `String`                                                 | `'search'` | The label of the search input.                                                                                                                                                                         |
| `searchProp`     | `String`                                                 | `'search'` | The name of the search property of the HTTP request.                                                                                                                                                   |
| `listProp`       | `String`                                                 | `''`       | Name of the property in response.data where the list is stored.                                                                                                                                        |
| `url`            | `String`                                                 | `''`       | The url to get the options.                                                                                                                                                                            |
| `value`          | `Array`                                                  | `[]`       | The current value of the selection.                                                                                                                                                                    |
| `mapper`         | `NgJvxOptionMapper`                                      | `*`        | The object that will map the response of the async call.                                                                                                                                               |
| `searchMapper`   | `NgJvxSearchMapper`                                      | `*`        | The object that will map the client search result.                                                                                                                                                     |
| `pageSize`       | `number`                                                 | `15`       | The size of a page for pagination purposes.                                                                                                                                                            |
| `groupBy`        | <code>NgJvxGroupMapper<any>&#124;string&#124;null</code> | `null`     | If it's a `string` it defines the the property of each option by which group them in the list. If it's a `NgJvxGroupMapper` it offers a method that groups the options (useful for nested properties). |                

### Methods

*None*

### Events

| Event Name    | Detail  | Description                                                                                         |
|---------------|---------|-----------------------------------------------------------------------------------------------------|
| `valueChange` | `Array` | Fired when the user changes the value of the input. The detail contains the value of the selection. |
| `scrollEnd`   | *None*  | Fired when the scrollbar in the options menu reaches the bottom.                                    |
| `open`        | *None*  | Fired when the the menu starts opening.                                                             |
| `opened`      | *None*  | Fired when the the menu is opened.                                                                  |
| `close`       | *None*  | Fired when the the menu starts closing.                                                             |
| `closed`      | *None*  | Fired when the the menu is closed.                                                                  |

### Groups

It is possible to collect the options in groups. To do so the user can set the property `groupBy` with the name of the property they want to group the options by.
If the property is nested or the user wants to implement a more complex grouping algorithm, they set the property `groupBy` with an object that implements the interface `NgJvxGroupMapper<T>`.
This object offers the method 
```typescript
mapGroup(option: T): Observable<NgJvxGroup<T>>
```
with
```typescript
interface NgJvxGroup<T> {
  group: string;
  option: T;
}
```
The `mapGroup` method hence takes the option and wraps it in an object that defines the name of the group it belongs to.
It is possible to define the look of the headers of the groups with the directive [*ngJvxGroupHeaderTemplate](#ngjvxgroupheadertemplate)
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

The `multiMapper` property works like the `mapper` property, it implements the interface `NgJvxOptionsMapper<T>`.
It will expose a method `mapOptions` which accepts all the options to be mapped in the form of an Object and returns an Observable of type `T[]`.
For example if the request returns an array of objects like this:

```javascript
{
  id: number;
  description: string;
}
```

it is possible to write a mapper like this:

```javascript
 const mapper: NgJvxOptionMultiMapper<{value: number, text: string}> = {
  mapOption(source: {
    id: number,
    description: string
  }[]): Observable<any> {
    return of(source.map(s=>{value: s.id, text: s.description}));
  }
}
```

It's useful if the user wants to add any custom option to a server call
#### Search

If the property `searchInput` is `true`, the user will be able to search a value amongst the options.
`searchProp` defines the name of the property for the HTTP call.

##### searchMapper

The `searchMapper` property is an object implementing the interface `NgJvxSearchMapper<T>`. It exposes the
method `mapSearch` which accepts the value of the search (a string) and an array of the selectable options. 
The method returns an Observable of type `T[]`. 
The value of the returned Observable will then be used as the new option list.
This property is only useful for a client side search.

For example:
```typescript
const searchMapper: NgJvxSearchMapper<{text: string, value: number}> = {
  mapSearch: (source: string, options: {text: string, value: number}[]): Observable<{text: string, value: number}[]> => {
     return of(options.filter(o => o.text.toLowerCase().includes(source.toLowerCase())));
  }
}
```

### Slots

#### default

The default slot allows to define the options directly via html. It's not compatible with the `url` parameter. The
options shall be wrapped in the `<ng-jvx-option>` component. The slot shall not be wrapped in the `<ng-jvx-option>`
component if it's decorated with one of the available directives, since it will have different purposes.

#### placeholder

The slot `placeholder` will define the placeholder. It's shown only when the selection's value is empty.

### Directives

#### ngJvxOptionsTemplate

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

#### *ngJvxDisabledOption

This directive disables the selection of the host option. i.e.

```angular2html

<div *ngJvxOptionsTemplate="let option" [ngJvxDisabledOption]="option.text === 'text of the disabled option'">
  <span>{{option.text}}</span>
  <span>
        <img src="{{option.preview}}"/>
    </span>
</div>
```
