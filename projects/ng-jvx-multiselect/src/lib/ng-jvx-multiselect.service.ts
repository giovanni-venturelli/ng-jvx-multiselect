import {Injectable, input} from '@angular/core';
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
            data,
            paginationProp
          }: {
    url: string, ignorePagination: boolean,
    currentPage: number,
    pageSize: number,
    requestType: 'get' | 'post',
    requestHeaders: any,
    search?: string,
    searchProp?: string,
    data: any,

    paginationProp: { page: string, pageSize: string },
    paginationResponse: { currentPage: string, totalRows: string }
  }): Observable<any> {
    let params = new HttpParams();
    if (search && search.length > 0) {
      params = params.set(searchProp, search);
    }
    if (!ignorePagination) {
      params = params.set(paginationProp.page, currentPage.toString())
        .set(paginationProp.pageSize, pageSize.toString());
    }
    if (requestType === 'get') {
      const options = {
        mode: 'no-cors' as RequestMode, // cors
        headers: requestHeaders,
        context: setJvxCall(),
        // withCredentials: true,
        // credentials: 'same-origin', // cache: 'default',
        params
      };
      return this.http.get(url, options);
    } else {
      const options = {
        mode: 'no-cors' as RequestMode, // cors
        headers: requestHeaders,
        context: setJvxCall(),
        // withCredentials: true,
        // credentials: 'same-origin', // cache: 'default',
      };
      const postParams = {
        [searchProp]: params.get('smartSearch'),
        paging: [paginationProp.page, paginationProp.pageSize, 'sort', 'ignorePagination'].reduce((obj, key) => {
          obj[key] = params.get(key);
          if (key === 'sort' && !params.get(key)) {
            obj[key] = '';
          } else if (key === 'ignorePagination' && !params.get(key)) {
            obj[key] = false;
          }
          return obj;
        }, {})
      };
      const payload = {
        ...postParams,
        ...data
      };
      return this.http.post(url, payload, options);
    }
  }
}
