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
      const postParams: any = {};

      // Aggiungi search solo se presente
      if (search && search.length > 0) {
        postParams[searchProp] = search;
      }

      // Gestisci paginazione come nella GET
      if (!ignorePagination) {
        postParams.paging = {
          sort: '',
          ignorePagination: false
        };
        postParams.paging[paginationProp.page] = currentPage.toString();
        postParams.paging[paginationProp.pageSize] = pageSize.toString();
      } else {
        postParams.paging = {
          sort: '',
          ignorePagination: true
        };
      }
      const payload = {
        ...postParams,
        ...data
      };
      return this.http.post(url, payload, options);
    }
  }
}
