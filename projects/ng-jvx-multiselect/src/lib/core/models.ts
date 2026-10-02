/** HTTP verb used to fetch remote options. Case-insensitive. */
export type NgJvxRequestType = 'get' | 'post' | 'GET' | 'POST';

/**
 * Where the search is performed:
 * - `'client'`: the options already available are filtered with the `searchMapper`;
 * - `'server'`: the search text is sent to the backend;
 * - `null`: server-side when an `url` is set, no search otherwise.
 */
export type NgJvxSearchMode = 'client' | 'server' | null;

/** Names of the pagination parameters sent to the backend. */
export interface NgJvxPaginationProp {
  page: string;
  pageSize: string;
}

/** Names of the pagination properties read from the backend response. */
export interface NgJvxPaginationResponse {
  currentPage: string;
  totalPages: string;
  totalRows: string;
}

/** A group of options, as rendered in the panel and exposed to `*ngJvxGroupHeader`. */
export interface NgJvxOptionGroup<T = any> {
  group: any;
  options: T[];
}

export const DEFAULT_PAGINATION_PROP: NgJvxPaginationProp = {page: 'page', pageSize: 'size'};

export const DEFAULT_PAGINATION_RESPONSE: NgJvxPaginationResponse = {
  currentPage: 'pageNo',
  totalPages: 'pageCount',
  totalRows: 'totalRecordCount'
};

export const DEFAULT_PAGINATION_RESPONSE_PROP = 'pagingInfo';

/** Smallest page size accepted by the component. */
export const MIN_PAGE_SIZE = 15;
