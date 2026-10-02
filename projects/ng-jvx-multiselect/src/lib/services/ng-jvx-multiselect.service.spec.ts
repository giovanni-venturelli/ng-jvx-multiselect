import {TestBed} from '@angular/core/testing';
import {HttpHeaders, provideHttpClient} from '@angular/common/http';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {NgJvxListRequest, NgJvxMultiselectService} from './ng-jvx-multiselect.service';
import {JVXMULTISELECT} from '../core/http-context';
import {DEFAULT_PAGINATION_PROP} from '../core/models';

describe('NgJvxMultiselectService', () => {
  let service: NgJvxMultiselectService;
  let http: HttpTestingController;

  const request = (overrides: Partial<NgJvxListRequest> = {}): NgJvxListRequest => ({
    url: '/api/options',
    ignorePagination: false,
    currentPage: 2,
    pageSize: 15,
    requestType: 'get',
    requestHeaders: new HttpHeaders({'X-Test': 'yes'}),
    search: 'abc',
    searchProp: 'search',
    data: {},
    paginationProp: DEFAULT_PAGINATION_PROP,
    ...overrides
  });

  beforeEach(() => {
    TestBed.configureTestingModule({providers: [provideHttpClient(), provideHttpClientTesting()]});
    service = TestBed.inject(NgJvxMultiselectService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('sends search and pagination as query parameters on GET', () => {
    service.getList(request()).subscribe();
    const req = http.expectOne(r => r.url === '/api/options');
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('search')).toBe('abc');
    expect(req.request.params.get('page')).toBe('2');
    expect(req.request.params.get('size')).toBe('15');
    expect(req.request.headers.get('X-Test')).toBe('yes');
    expect(req.request.context.get(JVXMULTISELECT)).toBeTrue();
    req.flush([]);
  });

  it('omits empty search and pagination when ignored', () => {
    service.getList(request({search: '', ignorePagination: true})).subscribe();
    const req = http.expectOne(r => r.url === '/api/options');
    expect(req.request.params.keys()).toEqual([]);
    req.flush([]);
  });

  it('uses custom names for search and pagination parameters', () => {
    service.getList(request({searchProp: 'q', paginationProp: {page: 'p', pageSize: 'ps'}})).subscribe();
    const req = http.expectOne(r => r.url === '/api/options');
    expect(req.request.params.get('q')).toBe('abc');
    expect(req.request.params.get('p')).toBe('2');
    expect(req.request.params.get('ps')).toBe('15');
    req.flush([]);
  });

  it('sends search, paging and payload in the body on POST (case-insensitive)', () => {
    service.getList(request({requestType: 'POST', data: {department: 'sales'}})).subscribe();
    const req = http.expectOne('/api/options');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      search: 'abc',
      paging: {sort: '', ignorePagination: false, page: '2', size: '15'},
      department: 'sales'
    });
    expect(req.request.context.get(JVXMULTISELECT)).toBeTrue();
    req.flush([]);
  });

  it('sends only the paging flag on POST when pagination is ignored', () => {
    service.getList(request({requestType: 'post', search: '', ignorePagination: true})).subscribe();
    const req = http.expectOne('/api/options');
    expect(req.request.body).toEqual({paging: {sort: '', ignorePagination: true}});
    req.flush([]);
  });
});
