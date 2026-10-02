// Mock backend per la demo-sandbox di ng-jvx-multiselect.
// Nessuna dipendenza esterna: usa solo il modulo http di Node.
// Il dev-server Angular inoltra qui le chiamate tramite projects/demo-sandbox/proxy.conf.json.

const http = require('http');

const PORT = Number(process.env.MOCK_SERVER_PORT) || 3000;
const BASE_PATH = '/jvx-multiselect-test';
const DEFAULT_PAGE_SIZE = 10;
// Latenza simulata, per vedere lo spinner di caricamento del componente.
const LATENCY_MS = Number(process.env.MOCK_SERVER_LATENCY) || 400;

const OPTIONS = Array.from({length: 200}, (_, i) => ({
  value: i + 1,
  text: `value ${i + 1}`,
  group: i % 2 === 0 ? 'a' : 'b',
  nested: {group: i % 2 === 0 ? 'nested a' : 'nested b'}
}));

const DEPARTMENTS = ['Administration', 'Sales', 'Production', 'Research & development', 'IT'];
const FIRST_NAMES = ['Mario', 'Luca', 'Giulia', 'Anna', 'Marco', 'Sara', 'Paolo', 'Elena', 'Davide', 'Chiara'];
const LAST_NAMES = ['Rossi', 'Bianchi', 'Verdi', 'Russo', 'Ferrari', 'Esposito', 'Romano', 'Colombo', 'Ricci', 'Marino'];

// Forma "non standard" (id / firstName / lastName / department.name): serve a mostrare mapper,
// multiMapper e groupBy con NgJvxGroupMapper.
const PEOPLE = Array.from({length: 120}, (_, i) => ({
  id: 1000 + i,
  firstName: FIRST_NAMES[i % FIRST_NAMES.length],
  lastName: LAST_NAMES[Math.floor(i / FIRST_NAMES.length) % LAST_NAMES.length],
  department: {name: DEPARTMENTS[i % DEPARTMENTS.length]}
}));

function filterPeople(search) {
  if (!search) {
    return PEOPLE;
  }
  const term = String(search).toLowerCase();
  return PEOPLE.filter(p => `${p.firstName} ${p.lastName}`.toLowerCase().includes(term));
}

function filterOptions(search) {
  if (!search) {
    return OPTIONS;
  }
  const term = String(search).toLowerCase();
  return OPTIONS.filter(o => o.text.toLowerCase().includes(term));
}

// Risposta nel formato atteso dal componente con listProp = 'data' e i default di
// paginationResponseProp ('pagingInfo') e paginationResponse (pageNo / pageCount / totalRecordCount).
function paginate(list, {page, size, ignorePagination}) {
  if (ignorePagination) {
    return {data: list, pagingInfo: {pageNo: 1, pageCount: 1, totalRecordCount: list.length}};
  }
  const pageNo = Math.max(1, Number(page) || 1);
  const pageSize = Math.max(1, Number(size) || DEFAULT_PAGE_SIZE);
  const start = (pageNo - 1) * pageSize;
  return {
    data: list.slice(start, start + pageSize),
    pagingInfo: {
      pageNo,
      pageCount: Math.ceil(list.length / pageSize),
      totalRecordCount: list.length
    }
  };
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', chunk => raw += chunk);
    req.on('end', () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', reject);
  });
}

function send(res, status, body) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS'
  });
  res.end(body === undefined ? '' : JSON.stringify(body));
}

const routes = {
  // GET ?search=...&page=1&size=10 (nomi di default di searchProp e paginationProp)
  'GET /get-test': async (req, url) => {
    const q = url.searchParams;
    return paginate(filterOptions(q.get('search')), {
      page: q.get('page'),
      size: q.get('size'),
      ignorePagination: !q.has('page')
    });
  },
  // POST { search, paging: { page, size, sort, ignorePagination }, ...postPayload }
  'POST /post-test': async (req) => {
    const body = await readBody(req);
    const paging = body.paging ?? {};
    return paginate(filterOptions(body.search), {
      page: paging.page,
      size: paging.size,
      ignorePagination: paging.ignorePagination === true
    });
  },
  // Echo di payload e header ricevuti, per verificare postPayload e requestHeaders
  'POST /echo': async (req) => {
    const body = await readBody(req);
    const paging = body.paging ?? {};
    return {
      ...paginate(filterOptions(body.search), {
        page: paging.page,
        size: paging.size,
        ignorePagination: paging.ignorePagination === true
      }),
      echo: {body, headers: {authorization: req.headers.authorization, 'x-demo': req.headers['x-demo']}}
    };
  },
  // Nomi di parametri e risposta personalizzati:
  // GET ?q=...&pageNumber=1&pageLength=20 -> { results: [...], meta: { current, pages, total } }
  'GET /people': async (req, url) => {
    const q = url.searchParams;
    const {data, pagingInfo} = paginate(filterPeople(q.get('q')), {
      page: q.get('pageNumber'),
      size: q.get('pageLength'),
      ignorePagination: !q.has('pageNumber')
    });
    return {
      results: data,
      meta: {current: pagingInfo.pageNo, pages: pagingInfo.pageCount, total: pagingInfo.totalRecordCount}
    };
  },
  // Lista semplice non paginata (array), da usare con listProp vuoto e ignorePagination
  'GET /list': async (req, url) => filterOptions(url.searchParams.get('search'))
};

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  if (req.method === 'OPTIONS') {
    return send(res, 204);
  }
  const path = url.pathname.startsWith(BASE_PATH) ? url.pathname.slice(BASE_PATH.length) : null;
  const handler = path !== null && routes[`${req.method} ${path}`];
  if (!handler) {
    return send(res, 404, {error: `Not found: ${req.method} ${url.pathname}`});
  }
  try {
    const result = await handler(req, url);
    await new Promise(r => setTimeout(r, LATENCY_MS));
    console.log(`[mock-server] ${req.method} ${url.pathname}${url.search} -> 200`);
    send(res, 200, result);
  } catch (e) {
    console.error(`[mock-server] ${req.method} ${url.pathname} -> 400`, e.message);
    send(res, 400, {error: e.message});
  }
});

server.listen(PORT, () => {
  console.log(`[mock-server] in ascolto su http://localhost:${PORT}${BASE_PATH}`);
});
