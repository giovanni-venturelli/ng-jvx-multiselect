import {Component, DOCUMENT, inject} from '@angular/core';
import {LogPanelComponent} from './shared/log-panel.component';
import {Lang, LANG, LANGS, setLang, t} from './shared/i18n';
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

interface NavGroup {
  title: string;
  links: { anchor: string, label: string }[];
}

@Component({
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
      language: 'Language'
    },
    it: {
      intro: `Una select Angular per selezione singola e multipla, con opzioni statiche o caricate dal backend.
        Ogni sezione mostra un esempio dal vivo e il codice per ottenerlo. Gli esempi remoti usano il mock server
        avviato da <code>npm start</code> (<code>projects/mock-server</code>).`,
      examples: 'Esempi',
      language: 'Lingua'
    }
  });

  readonly nav: NavGroup[] = t({
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
  });

  constructor() {
    inject(DOCUMENT).documentElement.lang = LANG;
  }

  changeLang(lang: Lang): void {
    setLang(lang);
  }
}
