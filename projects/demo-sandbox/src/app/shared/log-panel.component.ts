import {Component, computed, inject, signal} from '@angular/core';
import {DatePipe, JsonPipe} from '@angular/common';
import {EventLogService, LogKind} from './event-log.service';
import {t} from './i18n';

@Component({
  selector: 'app-log-panel',
  imports: [DatePipe, JsonPipe],
  template: `
    <aside class="log-panel" [class.collapsed]="collapsed()">
      <header>
        <button type="button" class="title" (click)="collapsed.set(!collapsed())" [attr.aria-expanded]="!collapsed()">
          <span>{{ txt.title }}</span>
          <span class="count">{{ log.entries().length }}</span>
          <span class="chevron">{{ collapsed() ? '▴' : '▾' }}</span>
        </button>
        @if (!collapsed()) {
          <div class="filters">
            @for (f of filters; track f.value) {
              <button type="button" [class.active]="filter() === f.value" (click)="filter.set(f.value)">{{ f.label }}</button>
            }
            <button type="button" (click)="log.clear()">{{ txt.clear }}</button>
          </div>
        }
      </header>
      @if (!collapsed()) {
        <ol class="entries">
          @for (e of visible(); track e.id) {
            <li [class]="e.kind">
              <div class="line">
                <time>{{ e.time | date: 'HH:mm:ss.SSS' }}</time>
                <span class="source">{{ e.source }}</span>
                <span class="message">{{ e.message }}</span>
              </div>
              @if (e.detail !== undefined) {
                <details>
                  <summary>{{ txt.details }}</summary>
                  <pre>{{ e.detail | json }}</pre>
                </details>
              }
            </li>
          } @empty {
            <li class="empty">{{ txt.empty }}</li>
          }
        </ol>
      }
    </aside>
  `,
  styleUrl: './log-panel.component.scss'
})
export class LogPanelComponent {
  readonly log = inject(EventLogService);
  readonly collapsed = signal(false);
  readonly filter = signal<LogKind | 'all'>('all');
  readonly txt = t({
    en: {title: 'Events & HTTP log', clear: 'Clear', details: 'details', all: 'All', events: 'Events',
      empty: 'Interact with the examples to see events and HTTP calls.'},
    it: {title: 'Log eventi e HTTP', clear: 'Svuota', details: 'dettagli', all: 'Tutti', events: 'Eventi',
      empty: 'Interagisci con gli esempi per vedere eventi e chiamate HTTP.'}
  });
  readonly filters: { label: string, value: LogKind | 'all' }[] = [
    {label: this.txt.all, value: 'all'},
    {label: this.txt.events, value: 'event'},
    {label: 'HTTP', value: 'http'}
  ];
  readonly visible = computed(() => {
    const f = this.filter();
    return f === 'all' ? this.log.entries() : this.log.entries().filter(e => e.kind === f);
  });
}
