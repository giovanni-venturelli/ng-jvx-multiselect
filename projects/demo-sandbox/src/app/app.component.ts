import {Component, OnInit} from '@angular/core';
import {HttpHeaders} from '@angular/common/http';
import {Observable, of, timer} from 'rxjs';
import {UntypedFormBuilder, FormControl, UntypedFormGroup, Validators} from '@angular/forms';
import {JVXMULTISELECT, NgJvxGroup, NgJvxGroupMapper, NgJvxOptionMapper} from 'ng-jvx-multiselect';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  width = 0;
  title = 'demo-sandbox';
  public mapper = {
    mapOption(source: any): Observable<{ value: number, text: string }> {
      return of({
        value: source.value,
        text: source.text+'---'
      });
    }
  } as NgJvxOptionMapper<{ value: number, text: string }>;
  public selectedValue = [
    {text: 'value 1', value: 1}
  ];
  public loaded = true;
  public form: UntypedFormGroup;
  public url = 'https://localhost:3000/jvx-multiselect-test';
  public groupMapper: NgJvxGroupMapper<any> = {
    mapGroup(option: any): Observable<NgJvxGroup<any>> {
      return of({group: option.nested.group, option});
    }
  };

  public options = [
    {value: 1, text: 'text 1'},
    {value: 2, text: 'text 2'},
    {value: 3, text: 3},
    {value: 4, text: 'text 4'},
    {value: 5, text: 'text 5'}];

  // public options = [
  //   {group: 'a', nested: {group: 'nested a'}, text: 'value 0', value: 0},
  //   {group: 'a', nested: {group: 'nested a'}, text: 'value 1', value: 1},
  //   {group: 'a', nested: {group: 'nested a'}, text: 'value 2', value: 2},
  //   {group: 'a', nested: {group: 'nested a'}, text: 'value 3', value: 3},
  //   {group: 'a', nested: {group: 'nested a'}, text: 'value 4', value: 4},
  //   {group: 'a', nested: {group: 'nested a'}, text: 'value 5', value: 5},
  //   {group: 'a', nested: {group: 'nested a'}, text: 'value 6', value: 6},
  //   {group: 'a', nested: {group: 'nested a'}, text: 'value 7', value: 7},
  //   {group: 'a', nested: {group: 'nested a'}, text: 'value 8', value: 8},
  //   {group: 'a', nested: {group: 'nested a'}, text: 'value 9', value: 9},
  //   {group: 'b', nested: {group: 'nested b'}, text: 'value 10', value: 10},
  //   {group: 'b', nested: {group: 'nested b'}, text: 'value 11', value: 11},
  //   {group: 'b', nested: {group: 'nested b'}, text: 'value 12', value: 12},
  //   {group: 'b', nested: {group: 'nested b'}, text: 'value 13', value: 13},
  //   {group: 'b', nested: {group: 'nested b'}, text: 'value 14', value: 14},
  //   {group: 'b', nested: {group: 'nested b'}, text: 'value 15', value: 15},
  //   {group: 'b', nested: {group: 'nested b'}, text: 'value 16', value: 16}
  // ];

  constructor(private formBuilder: UntypedFormBuilder) {
    this.form = this.formBuilder.group({
      selectionValue: [this.selectedValue, Validators.required],
      testInput: ['', Validators.required]
    });

    const stocazzo = JVXMULTISELECT;
    this.form.valueChanges.subscribe((val) => {

    });
  }

  getUrl(): string {
    return 'http://vm-web2016/Visitatori.Next.Api/api/utenti';
  }

  changeOption(num: number): void {
    this.selectedValue = [{value: num, text: 'opzione ' + num}];
  }

  reload(): void {
    this.loaded = false;
    setTimeout(() => {
      this.loaded = true;
    }, 0);

  }

  // get selectionValue(): any[] {
  //   // return [this.selectedValue[0]?.value];
  // }
  // set selectionValue(val: any[]) {
  // }
  checkValidity(): void {
    this.form.markAllAsTouched();
    this.form.controls.selectionValue.updateValueAndValidity();
    this.form.controls.testInput.updateValueAndValidity();
    this.form.markAllAsTouched();
  }

  ngOnInit(): void {
    timer(500).subscribe(() => {
      this.width = 257;
    });
  }
}
