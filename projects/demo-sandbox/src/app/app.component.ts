import {Component} from '@angular/core';
import {HttpHeaders} from '@angular/common/http';
import {window} from 'rxjs/operators';
import {NgJvxOptionMapper} from '../../../../dist/ng-jvx-multiselect/lib/interfaces/ng-jvx-option-mapper';
import {of} from 'rxjs';

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
    mapOption(source: any): any {
      return of({
        value: source.id,
        text: source.title
      });
    }
  } as NgJvxOptionMapper;

  getUrl(): string {
    return 'http://vm-web2016/Visitatori.Next.Api/api/utenti';
  }
}
