import {Component} from '@angular/core';
import {HttpHeaders} from '@angular/common/http';
import {window} from 'rxjs/operators';
import {NgJvxOptionMapper} from 'ng-jvx-multiselect';
import {Observable, of} from 'rxjs';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

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
