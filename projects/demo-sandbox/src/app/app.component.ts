import {Component} from '@angular/core';
import {HttpHeaders} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {NgJvxGroup, NgJvxGroupMapper, NgJvxOptionMapper} from '../../../ng-jvx-multiselect/src/public-api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'demo-sandbox';
  requestHeaders = new HttpHeaders().set(
    'Visitatori-API-Token',
    'FnrkkS3aH9vmX8jIgBJhywH36Bp5ecmpHZyMOzrlGKZLQpnZ1Hjcx/BFbq1toGzTPE9fYnkpOxtohJMDmRZnW9g0mTSYnsSrMsycAkRH8Ol+81mEjdyh+8sicTA5XN733c67yuVyS6NQRw/P1KPS433pAIjIZvVoG6ZSekVr2ZrdskJv82ZZTEYQAcosz3OSaBlP7dxTllQu++Rgw/N5tq02YIQ49vqX7Whylzt0DzeGjCuydiVDkwBVfLCsHQBx')
    .set('NOC', '1').set(
      'Access-Control-Allow-Origin', '*'
    ).set(
      'Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, Visitatori-API-Token'
    );
  public mapper = {
    mapOption(source: any): Observable<{ value: number, text: string }> {
      return of({
        value: source.id,
        text: source.title
      });
    }
  } as NgJvxOptionMapper<{ value: number, text: string }>;
  public selectedValue = [{text: 'value 1', value: 1}];
  public loaded = true;
  public form: FormGroup;
  public groupMapper: NgJvxGroupMapper<any> = {
    mapGroup(option: any): Observable<NgJvxGroup<any>> {
      return of({group: option.nested.group, option});
    }
  };
  public options = [
    {group: 'a', nested: {group: 'nested a'}, text: 'value 0', value: 0},
    {group: 'a', nested: {group: 'nested a'}, text: 'value 1', value: 1},
    {group: 'a', nested: {group: 'nested a'}, text: 'value 2', value: 2},
    {group: 'a', nested: {group: 'nested a'}, text: 'value 3', value: 3},
    {group: 'a', nested: {group: 'nested a'}, text: 'value 4', value: 4},
    {group: 'a', nested: {group: 'nested a'}, text: 'value 5', value: 5},
    {group: 'a', nested: {group: 'nested a'}, text: 'value 6', value: 6},
    {group: 'a', nested: {group: 'nested a'}, text: 'value 7', value: 7},
    {group: 'a', nested: {group: 'nested a'}, text: 'value 8', value: 8},
    {group: 'a', nested: {group: 'nested a'}, text: 'value 9', value: 9},
    {group: 'b', nested: {group: 'nested b'}, text: 'value 10', value: 10},
    {group: 'b', nested: {group: 'nested b'}, text: 'value 11', value: 11},
    {group: 'b', nested: {group: 'nested b'}, text: 'value 12', value: 12},
    {group: 'b', nested: {group: 'nested b'}, text: 'value 13', value: 13},
    {group: 'b', nested: {group: 'nested b'}, text: 'value 14', value: 14},
    {group: 'b', nested: {group: 'nested b'}, text: 'value 15', value: 15},
    {group: 'b', nested: {group: 'nested b'}, text: 'value 16', value: 16}
  ];

  constructor(private formBuilder: FormBuilder) {
    console.log('selected value: ');
    console.log(this.selectedValue);
    this.form = this.formBuilder.group({
      selectionValue: [this.selectedValue, Validators.required],
      testInput: ['', Validators.required]
    });


    this.form.valueChanges.subscribe((val) => {
      console.log('value change');
      console.log(val);
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
}
