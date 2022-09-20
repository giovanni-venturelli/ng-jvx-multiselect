import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';
import {setJvxCall} from './utils';

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
            search,
            searchProp = 'search',
            data
          }: {
    url: string, ignorePagination: boolean,
    currentPage: number,
    pageSize: number,
    requestType: 'get' | 'post',
    requestHeaders: any,
    search?: string,
    searchProp?: string,
    data: any
  }): Observable<any> {
    let params = new HttpParams();
    if (search && search.length > 0) {
      params = params.set(searchProp, search);
    }
    if (!ignorePagination) {
      params = params.set('page', currentPage.toString())
        .set('size', pageSize.toString());
    }
    const options = {
      mode: 'no-cors', // cors
      headers: requestHeaders,
      context: setJvxCall(),
      // withCredentials: true,
      // credentials: 'same-origin', // cache: 'default',
      data,
      params
    };
    if (requestType === 'get') {
      return this.http.get(url, options);
    } else {
      return this.http.post(url, options);
    }
  }
}
