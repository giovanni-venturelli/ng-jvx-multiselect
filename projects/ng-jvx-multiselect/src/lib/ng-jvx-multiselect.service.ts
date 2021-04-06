import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';

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
            pageSize,
            requestType = 'get',
            requestHeaders,
            data
          }: {
    url: string, ignorePagination: boolean,
    currentPage: number,
    pageSize: number,
    requestType: 'get' | 'post',
    requestHeaders: any, data: any
  }): Observable<any> {
    const options = {
      mode: 'no-cors', // cors
      headers: requestHeaders,
      withCredentials: true,
      credentials: 'same-origin', // cache: 'default',
      data,
      params: new HttpParams()
        .set('page', currentPage.toString())
        .set('size', pageSize.toString())
    };
    if (requestType === 'get') {
      return this.http.get(url, options);
    } else {
      return this.http.post(url, options);
    }
  }
}
