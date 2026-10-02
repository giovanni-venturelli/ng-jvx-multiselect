import {Component, inject, signal} from '@angular/core';
import {DatePipe} from '@angular/common';
import {NgJvxMultiselectComponent} from 'ng-jvx-multiselect';
import {DemoSectionComponent} from '../shared/demo-section.component';
import {EventLogService} from '../shared/event-log.service';
import {t} from '../shared/i18n';
import {LONG_LIST, Option} from '../shared/sample-data';

@Component({
  selector: 'app-events-example',
  imports: [NgJvxMultiselectComponent, DemoSectionComponent, DatePipe],
  template: `
    <app-demo-section anchor="events" [title]="txt.title" [description]="txt.description" [features]="features" [code]="code">
      <div class="demo-grid">
        <div class="demo-field">
          <label>{{ txt.label }}</label>
          <ng-jvx-multiselect #ms [options]="items" [multi]="true" [closeButton]="false"
                              (jvxMultiselectOpen)="emit('jvxMultiselectOpen')"
                              (jvxMultiselectOpened)="emit('jvxMultiselectOpened')"
                              (jvxMultiselectClose)="emit('jvxMultiselectClose')"
                              (jvxMultiselectClosed)="emit('jvxMultiselectClosed')"
                              (scrollEnd)="emit('scrollEnd')"
                              (valueChange)="emit('valueChange', $event)">
            <span placeholder>{{ txt.placeholder }}</span>
            <div ng-jvx-footer class="footer">
              <button type="button" (click)="ms.closeMenu()">{{ txt.close }}</button>
            </div>
          </ng-jvx-multiselect>
        </div>
        <ol class="event-list">
          @for (e of events(); track e.id) {
            <li><time>{{ e.time | date: 'HH:mm:ss.SSS' }}</time> <code>{{ e.name }}</code> {{ e.detail }}</li>
          } @empty {
            <li class="empty">{{ txt.empty }}</li>
          }
        </ol>
      </div>
    </app-demo-section>
  `,
  styles: `
    .event-list {
      list-style: none; margin: 0; padding: .5rem; max-height: 220px; overflow-y: auto;
      border: 1px solid var(--demo-border); border-radius: 8px; font-size: .8rem;
    }
    .event-list li { padding: .15rem 0; }
    .event-list time { color: var(--demo-muted); font-variant-numeric: tabular-nums; }
    .event-list .empty { color: var(--demo-muted); }
    .footer { padding: .5rem; display: flex; justify-content: flex-end; border-top: 1px solid var(--demo-border); }
  `
})
export class EventsExampleComponent {
  private readonly log = inject(EventLogService);
  private nextId = 0;
  readonly items = LONG_LIST;
  readonly events = signal<{ id: number, time: Date, name: string, detail: string }[]>([]);

  readonly txt = t({
    en: {
      title: 'Events and methods',
      description: `The component emits events when the menu opens and closes (before and after the animation), on
        every value change and when the option list is scrolled to the bottom. Through a template reference you can
        call public methods such as <code>closeMenu()</code>.`,
      label: 'Long list (scroll to the bottom)',
      placeholder: 'Open, scroll, select',
      close: 'Close with closeMenu()',
      empty: 'No events yet.',
      onStart: 'the menu starts opening',
      onOpened: 'menu opened',
      onClose: 'the menu starts closing',
      onClosed: 'menu closed',
      onScrollEnd: 'scrolled to the bottom'
    },
    it: {
      title: 'Eventi e metodi',
      description: `Il componente emette eventi all'apertura e chiusura del menu (prima e dopo l'animazione), a ogni cambio
        di valore e quando lo scroll delle opzioni arriva in fondo. Tramite riferimento al template si possono chiamare
        metodi pubblici come <code>closeMenu()</code>.`,
      label: 'Lista lunga (scorri fino in fondo)',
      placeholder: 'Apri, scorri, seleziona',
      close: 'Chiudi con closeMenu()',
      empty: 'Nessun evento ancora.',
      onStart: 'il menu inizia ad aprirsi',
      onOpened: 'menu aperto',
      onClose: 'il menu inizia a chiudersi',
      onClosed: 'menu chiuso',
      onScrollEnd: 'scroll arrivato in fondo'
    }
  });

  emit(name: string, value?: Option[]): void {
    const detail = value ? `[${value.map(v => v.text).join(', ')}]` : '';
    this.events.update(list => [{id: this.nextId++, time: new Date(), name, detail}, ...list].slice(0, 30));
    this.log.event('events', name, value);
  }

  readonly features = ['(valueChange)', '(jvxMultiselectOpen)', '(jvxMultiselectOpened)', '(jvxMultiselectClose)',
    '(jvxMultiselectClosed)', '(scrollEnd)', 'closeMenu()'];
  readonly code = [
    {
      label: 'HTML', content: `<ng-jvx-multiselect #ms [options]="items" [multi]="true"
                    (jvxMultiselectOpen)="..."    <!-- ${this.txt.onStart} -->
                    (jvxMultiselectOpened)="..."  <!-- ${this.txt.onOpened} -->
                    (jvxMultiselectClose)="..."   <!-- ${this.txt.onClose} -->
                    (jvxMultiselectClosed)="..."  <!-- ${this.txt.onClosed} -->
                    (scrollEnd)="..."             <!-- ${this.txt.onScrollEnd} -->
                    (valueChange)="onChange($event)">
  <div ng-jvx-footer>
    <button (click)="ms.closeMenu()">${this.txt.close}</button>
  </div>
</ng-jvx-multiselect>`
    }
  ];
}
