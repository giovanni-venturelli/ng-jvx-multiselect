import {
  afterRenderEffect,
  ChangeDetectionStrategy,
  Component,
  computed,
  DOCUMENT,
  ElementRef,
  inject,
  signal,
  viewChild
} from '@angular/core';
import {LogPanelComponent} from './shared/log-panel.component';
import {Lang, LANG, LANGS, setLang, t} from './shared/i18n';
import {filterNav, NavGroup} from './shared/nav-filter';
import {highlightMatches} from './shared/search-highlight';
import {BasicExampleComponent} from './examples/basic-example.component';
import {MultiExampleComponent} from './examples/multi-example.component';
import {CustomKeysExampleComponent} from './examples/custom-keys-example.component';
import {ClientSearchExampleComponent} from './examples/client-search-example.component';
import {TemplatesExampleComponent} from './examples/templates-example.component';
import {GroupsExampleComponent} from './examples/groups-example.component';
import {RemoteGetExampleComponent} from './examples/remote-get-example.component';
import {RemotePostExampleComponent} from './examples/remote-post-example.component';
import {RemoteMappingExampleComponent} from './examples/remote-mapping-example.component';
import {RemoteListExampleComponent} from './examples/remote-list-example.component';
import {FormsExampleComponent} from './examples/forms-example.component';
import {EventsExampleComponent} from './examples/events-example.component';
import {ThemingExampleComponent} from './examples/theming-example.component';

/**
 * Termini tecnici (nomi di input, output, direttive e componenti) per cui un esempio deve comparire nella ricerca,
 * oltre al titolo del link. Sono uguali nelle due lingue.
 */
const KEYWORDS: Record<string, string[]> = {
  'single': ['options', 'value', 'disabled', 'clearable', 'placeholder'],
  'multi': ['chip', 'closeButton', 'closeOnClick', 'clearable'],
  'custom-keys': ['itemValue', 'itemText'],
  'client-search': ['searchInput', 'searchMode', 'searchLabel', 'searchMapper'],
  'templates': ['chip', 'ngJvxOptionsTemplate', 'ngJvxSelectionTemplate', 'ngJvxDisabledOption', 'footer', 'template'],
  'groups': ['groupBy', 'ngJvxGroupHeader', 'NgJvxGroupMapper'],
  'remote-get': ['url', 'get', 'listProp', 'pageSize', 'searchProp', 'paginationResponseProp', 'scrollEnd',
    'totalRows', 'totalPages'],
  'remote-post': ['post', 'postPayload', 'requestHeaders', 'JVXMULTISELECT', 'interceptor'],
  'remote-mapping': ['mapper', 'searchProp', 'paginationProp', 'listProp', 'paginationResponse'],
  'remote-list': ['ignorePagination', 'multiMapper', 'value', 'valueChange'],
  'forms': ['formControlName', 'ngModel', 'JvxMultiselectValidators', 'reactive forms', 'validators'],
  'events': ['valueChange', 'open', 'opened', 'close', 'closed', 'scrollEnd', 'closeMenu'],
  'theming': ['css variables', '--jvx-multiselect-primary', 'panelClass', 'theme']
};

function withKeywords(nav: NavGroup[]): NavGroup[] {
  return nav.map(group => ({
    ...group,
    links: group.links.map(link => ({...link, keywords: KEYWORDS[link.anchor]}))
  }));
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'app-root',
  imports: [
    LogPanelComponent,
    BasicExampleComponent,
    MultiExampleComponent,
    CustomKeysExampleComponent,
    ClientSearchExampleComponent,
    TemplatesExampleComponent,
    GroupsExampleComponent,
    RemoteGetExampleComponent,
    RemotePostExampleComponent,
    RemoteMappingExampleComponent,
    RemoteListExampleComponent,
    FormsExampleComponent,
    EventsExampleComponent,
    ThemingExampleComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  readonly lang = LANG;
  readonly langs = LANGS;

  readonly txt = t({
    en: {
      intro: `An Angular select for single and multiple selection, with static options or options loaded from a
        backend. Each section shows a live example and the code behind it. The remote examples use the mock server
        started by <code>npm start</code> (<code>projects/mock-server</code>).`,
      examples: 'Examples',
      language: 'Language',
      search: 'Search examples',
      clearSearch: 'Clear search',
      noResults: 'No example matches your search.'
    },
    it: {
      intro: `Una select Angular per selezione singola e multipla, con opzioni statiche o caricate dal backend.
        Ogni sezione mostra un esempio dal vivo e il codice per ottenerlo. Gli esempi remoti usano il mock server
        avviato da <code>npm start</code> (<code>projects/mock-server</code>).`,
      examples: 'Esempi',
      language: 'Lingua',
      search: 'Cerca negli esempi',
      clearSearch: 'Cancella la ricerca',
      noResults: 'Nessun esempio corrisponde alla ricerca.'
    }
  });

  readonly query = signal('');
  readonly main = viewChild.required<ElementRef<HTMLElement>>('main');

  readonly nav: NavGroup[] = withKeywords(t({
    en: [
      {
        title: 'Static options',
        links: [
          {anchor: 'single', label: 'Single selection'},
          {anchor: 'multi', label: 'Multiple selection'},
          {anchor: 'custom-keys', label: 'Custom keys'},
          {anchor: 'client-search', label: 'Client-side search'},
          {anchor: 'templates', label: 'Custom templates'},
          {anchor: 'groups', label: 'Groups'}
        ]
      },
      {
        title: 'Options from a backend',
        links: [
          {anchor: 'remote-get', label: 'GET, pagination, search'},
          {anchor: 'remote-post', label: 'POST, headers, interceptor'},
          {anchor: 'remote-mapping', label: 'Custom API format'},
          {anchor: 'remote-list', label: 'Non-paginated list'}
        ]
      },
      {
        title: 'Integration',
        links: [
          {anchor: 'forms', label: 'Forms and validators'},
          {anchor: 'events', label: 'Events and methods'},
          {anchor: 'theming', label: 'Theme and panelClass'}
        ]
      }
    ],
    it: [
      {
        title: 'Opzioni statiche',
        links: [
          {anchor: 'single', label: 'Selezione singola'},
          {anchor: 'multi', label: 'Selezione multipla'},
          {anchor: 'custom-keys', label: 'Chiavi personalizzate'},
          {anchor: 'client-search', label: 'Ricerca lato client'},
          {anchor: 'templates', label: 'Template personalizzati'},
          {anchor: 'groups', label: 'Gruppi'}
        ]
      },
      {
        title: 'Opzioni da backend',
        links: [
          {anchor: 'remote-get', label: 'GET, paginazione, ricerca'},
          {anchor: 'remote-post', label: 'POST, header, interceptor'},
          {anchor: 'remote-mapping', label: 'API con formato custom'},
          {anchor: 'remote-list', label: 'Lista non paginata'}
        ]
      },
      {
        title: 'Integrazione',
        links: [
          {anchor: 'forms', label: 'Form e validatori'},
          {anchor: 'events', label: 'Eventi e metodi'},
          {anchor: 'theming', label: 'Tema e panelClass'}
        ]
      }
    ]
  }));

  readonly filteredNav = computed(() => filterNav(this.nav, this.query()));

  constructor() {
    inject(DOCUMENT).documentElement.lang = LANG;
    afterRenderEffect(() => highlightMatches(this.main().nativeElement, this.query()));
  }

  search(query: string): void {
    this.query.set(query);
  }

  /** Con Invio si va al primo esempio trovato. */
  goToFirstResult(): void {
    const first = this.filteredNav()[0]?.links[0];
    if (first) {
      location.hash = first.anchor;
    }
  }

  changeLang(lang: Lang): void {
    setLang(lang);
  }
}
