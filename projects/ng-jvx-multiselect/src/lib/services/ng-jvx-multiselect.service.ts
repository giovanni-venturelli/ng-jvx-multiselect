import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {setJvxCall} from '../core/http-context';
import {
  DEFAULT_PAGINATION_PROP,
  NgJvxPaginationProp,
  NgJvxPaginationResponse,
  NgJvxRequestType
} from '../core/models';

/** Parameters of a remote options request. */
export interface NgJvxListRequest {
  url: string;
  ignorePagination: boolean;
  currentPage: number;
  pageSize: number;
  requestType: NgJvxRequestType;
  requestHeaders: HttpHeaders | { [header: string]: string | string[] } | null | undefined;
  search?: string;
  searchProp?: string;
  /** Extra body properties of a POST request. */
  data: any;
  paginationProp: NgJvxPaginationProp;
  /** Not used to build the request; kept for backwards compatibility. */
  paginationResponse?: NgJvxPaginationResponse;
}

/**
 * Performs the HTTP calls of ng-jvx-multiselect.
 *
 * - GET: search and pagination are sent as query parameters (`?search=..&page=1&size=15`).
 * - POST: they are sent in the body as `{search, paging: {sort, ignorePagination, page, size}, ...data}`.
 *
 * Every request carries the `JVXMULTISELECT` HTTP context token.
 */
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
            paginationProp = DEFAULT_PAGINATION_PROP
          }: NgJvxListRequest): Observable<any> {
    const options = {headers: requestHeaders ?? undefined, context: setJvxCall()};

    if (requestType.toLowerCase() === 'post') {
      return this.http.post(url, this.buildBody(search, searchProp, ignorePagination, currentPage, pageSize,
        paginationProp, data), options);
    }
    return this.http.get(url, {
      ...options,
      params: this.buildParams(search, searchProp, ignorePagination, currentPage, pageSize, paginationProp)
    });
  }

  private buildParams(search: string | undefined, searchProp: string, ignorePagination: boolean, currentPage: number,
                      pageSize: number, paginationProp: NgJvxPaginationProp): HttpParams {
    let params = new HttpParams();
    if (search) {
      params = params.set(searchProp, search);
    }
    if (!ignorePagination) {
      params = params
        .set(paginationProp.page, String(currentPage))
        .set(paginationProp.pageSize, String(pageSize));
    }
    return params;
  }

  private buildBody(search: string | undefined, searchProp: string, ignorePagination: boolean, currentPage: number,
                    pageSize: number, paginationProp: NgJvxPaginationProp, data: any): Record<string, unknown> {
    const body: Record<string, unknown> = {};
    if (search) {
      body[searchProp] = search;
    }
    body.paging = ignorePagination
      ? {sort: '', ignorePagination: true}
      : {
        sort: '',
        ignorePagination: false,
        [paginationProp.page]: String(currentPage),
        [paginationProp.pageSize]: String(pageSize)
      };
    return {...body, ...(data ?? {})};
  }
}
