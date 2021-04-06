import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NgJvxMultiselectService {
  constructor(private http: HttpClient) {
  }

  getList({
            url,
            ignorePagination = false,
            currentPage,
            requestType = 'get',
            requestHeaders,
            data
          }: { url: string, ignorePagination: boolean, currentPage: number, requestType: 'get' | 'post', requestHeaders: any, data: any }): Observable<any> {
    const options = {
      mode: 'no-cors', // cors
      headers: requestHeaders,
      withCredentials: true,
      credentials: 'same-origin', // cache: 'default',
      data
    };
    if (requestType === 'get') {
      return this.http.get(url, options);
    } else {
      return this.http.post(url, options);
    }
  }
}
