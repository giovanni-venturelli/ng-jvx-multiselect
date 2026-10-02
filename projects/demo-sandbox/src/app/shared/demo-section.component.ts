import {Component, input, signal} from '@angular/core';
import {t} from './i18n';

export interface CodeSnippet {
  label: string;
  content: string;
}

/**
 * Contenitore di un esempio: titolo, descrizione (HTML), l'esempio dal vivo (content projection)
 * e il codice sorgente mostrato a schede.
 */
@Component({
  selector: 'app-demo-section',
  template: `
    <section class="demo-section" [id]="anchor()">
      <header>
        <h2>{{ title() }}</h2>
        <p class="description" [innerHTML]="description()"></p>
        @if (features().length > 0) {
          <ul class="features">
            @for (f of features(); track f) {
              <li><code>{{ f }}</code></li>
            }
          </ul>
        }
      </header>
      <div class="demo-body">
        <ng-content></ng-content>
      </div>
      @if (code().length > 0) {
        <div class="code">
          <div class="tabs" role="tablist">
            @for (snippet of code(); track snippet.label; let i = $index) {
              <button type="button" role="tab" [class.active]="i === activeTab()" [attr.aria-selected]="i === activeTab()"
                      (click)="activeTab.set(i); open.set(true)">{{ snippet.label }}</button>
            }
            <button type="button" class="toggle" (click)="open.set(!open())">{{ open() ? txt.hide : txt.show }}</button>
          </div>
          @if (open()) {
            <pre><code>{{ code()[activeTab()].content }}</code></pre>
          }
        </div>
      }
    </section>
  `,
  styleUrl: './demo-section.component.scss'
})
export class DemoSectionComponent {
  anchor = input.required<string>();
  title = input.required<string>();
  /** HTML semplice (code, strong) già tradotto. */
  description = input<string>('');
  features = input<string[]>([]);
  code = input<CodeSnippet[]>([]);

  activeTab = signal(0);
  open = signal(false);

  readonly txt = t({
    en: {show: 'Show code', hide: 'Hide code'},
    it: {show: 'Mostra codice', hide: 'Nascondi codice'}
  });
}
