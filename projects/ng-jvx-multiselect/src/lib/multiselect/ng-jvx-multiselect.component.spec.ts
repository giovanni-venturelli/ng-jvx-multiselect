import {Component, viewChild} from '@angular/core';
import {ComponentFixture, discardPeriodicTasks, fakeAsync, flush, TestBed, tick} from '@angular/core/testing';
import {FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {provideHttpClient} from '@angular/common/http';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {NgJvxMultiselectComponent} from './ng-jvx-multiselect.component';
import {NgJvxOptionComponent} from '../option/ng-jvx-option.component';
import {NgJvxMultisectChipComponent} from '../chip/ng-jvx-multiselect-chip.component';
import {NgJvxSelectionTemplateDirective} from '../directives/ng-jvx-selection-template.directive';
import {NgJvxSearchMode} from '../core/models';

interface Opt {
  value: number;
  text: string;
}

const OPTIONS: Opt[] = [
  {value: 1, text: 'Orange'},
  {value: 2, text: 'Lemon'},
  {value: 3, text: 'Apple'}
];

/** Panel animation (80ms) plus some margin. */
const ANIMATION = 100;

@Component({
  imports: [NgJvxMultiselectComponent, ReactiveFormsModule],
  template: `
    <ng-jvx-multiselect [formControl]="control"
                        [options]="options"
                        [multi]="multi"
                        [required]="required"
                        [url]="url"
                        listProp="data"
                        [searchInput]="searchInput"
                        [searchMode]="searchMode"
                        [closeOnClick]="closeOnClick"
                        [clearable]="true"
                        (valueChange)="changes.push($event)"
                        (jvxMultiselectOpen)="events.push('open')"
                        (jvxMultiselectOpened)="events.push('opened')"
                        (jvxMultiselectClose)="events.push('close')"
                        (jvxMultiselectClosed)="events.push('closed')"
                        (scrollEnd)="events.push('scrollEnd')"
                        (loadError)="errors.push($event)">
      <span placeholder>Pick</span>
    </ng-jvx-multiselect>
  `
})
class HostComponent {
  readonly select = viewChild.required(NgJvxMultiselectComponent);
  control = new FormControl<Opt[]>([]);
  options: Opt[] = OPTIONS;
  multi = false;
  required = false;
  url = '';
  searchInput = false;
  searchMode: NgJvxSearchMode = null;
  closeOnClick = true;
  changes: Opt[][] = [];
  events: string[] = [];
  errors: unknown[] = [];
}

describe('NgJvxMultiselectComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;
  let http: HttpTestingController;

  const el = (): HTMLElement => fixture.nativeElement;
  const trigger = (): HTMLElement => el().querySelector('[role=combobox]')!;
  const overlay = (): HTMLElement => document.querySelector('.cdk-overlay-container') as HTMLElement;
  const options = (): HTMLElement[] => Array.from(overlay()?.querySelectorAll('ng-jvx-option') ?? []);
  const optionTexts = (): string[] => options().map(o => o.textContent!.trim());
  const render = () => {
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
  };
  const open = () => {
    trigger().click();
    render();
    tick(ANIMATION);
    render();
  };
  const clickOption = (text: string) => {
    const option = options().find(o => o.textContent!.trim() === text)!;
    (option.querySelector('.ng-jvx-option') as HTMLElement).click();
    render();
  };
  const closeWithBackdrop = () => {
    (document.querySelector('.ng-jvx-panel-overlay') as HTMLElement).click();
    render();
    tick(ANIMATION);
    render();
  };
  const page = (from: number, count: number, total: number) => ({
    data: Array.from({length: count}, (_, i) => ({value: from + i, text: `value ${from + i}`})),
    pagingInfo: {pageNo: Math.ceil(from / 15), pageCount: Math.ceil(total / 15), totalRecordCount: total}
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HostComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
    document.querySelectorAll('.cdk-overlay-container').forEach(c => c.innerHTML = '');
  });

  describe('static options', () => {
    it('renders the placeholder and the options only while open', fakeAsync(() => {
      render();
      expect(el().textContent).toContain('Pick');
      expect(options().length).toBe(0);

      open();
      expect(optionTexts()).toEqual(['Orange', 'Lemon', 'Apple']);
      expect(trigger().getAttribute('aria-expanded')).toBe('true');
      expect(host.events).toEqual(['open', 'opened']);

      closeWithBackdrop();
      expect(options().length).toBe(0);
      expect(host.events).toEqual(['open', 'opened', 'close', 'closed']);
    }));

    it('selects a single option and closes the panel', fakeAsync(() => {
      render();
      open();
      clickOption('Lemon');
      tick(ANIMATION);
      render();

      expect(host.control.value).toEqual([OPTIONS[1]]);
      expect(host.changes).toEqual([[OPTIONS[1]]]);
      expect(options().length).toBe(0);
      expect(trigger().textContent).toContain('Lemon');
    }));

    describe('click on the already selected option', () => {
      const selectLemon = () => {
        host.control.setValue([OPTIONS[1]]);
        render();
        open();
        host.changes.length = 0;
      };

      it('deselects in single selection when not required', fakeAsync(() => {
        selectLemon();
        clickOption('Lemon');
        tick(ANIMATION);
        render();
        expect(host.control.value).toEqual([]);
        expect(host.changes).toEqual([[]]);
      }));

      it('keeps the selection and emits nothing in single selection when required', fakeAsync(() => {
        host.required = true;
        render();
        selectLemon();
        clickOption('Lemon');
        tick(ANIMATION);
        render();
        expect(host.control.value).toEqual([OPTIONS[1]]);
        expect(host.changes.length).toBe(0);
        expect(options().length).toBe(0);
      }));

      it('keeps the selection when the control has Validators.required', fakeAsync(() => {
        host.control.addValidators(Validators.required);
        render();
        selectLemon();
        clickOption('Lemon');
        tick(ANIMATION);
        render();
        expect(host.control.value).toEqual([OPTIONS[1]]);
        expect(host.changes.length).toBe(0);
      }));

      it('still toggles in multiple selection even when required', fakeAsync(() => {
        host.multi = true;
        host.required = true;
        render();
        selectLemon();
        clickOption('Lemon');
        expect(host.control.value).toEqual([]);
        expect(host.changes).toEqual([[]]);
        closeWithBackdrop();
      }));

      it('clear() still empties a required single selection', fakeAsync(() => {
        host.required = true;
        render();
        host.control.setValue([OPTIONS[1]]);
        render();
        host.changes.length = 0;
        host.select().clear();
        render();
        expect(host.control.value).toEqual([]);
        expect(host.changes).toEqual([[]]);
      }));
    });

    it('keeps the panel open with closeOnClick = false', fakeAsync(() => {
      host.closeOnClick = false;
      render();
      open();
      clickOption('Lemon');
      expect(options().length).toBe(3);
      closeWithBackdrop();
    }));

    it('toggles options in multiple selection, sorted by key', fakeAsync(() => {
      host.multi = true;
      render();
      open();
      clickOption('Apple');
      clickOption('Orange');
      expect(host.control.value!.map(o => o.value)).toEqual([1, 3]);
      expect(options().length).toBe(3);
      expect(options().filter(o => o.getAttribute('aria-selected') === 'true').length).toBe(2);

      clickOption('Apple');
      expect(host.control.value).toEqual([OPTIONS[0]]);
      closeWithBackdrop();
      expect(el().querySelectorAll('ng-jvx-multiselect-chip').length).toBe(1);
    }));

    it('removes an option through its chip', fakeAsync(() => {
      host.multi = true;
      host.control.setValue([OPTIONS[0], OPTIONS[1]]);
      render();
      (el().querySelector('ng-jvx-multiselect-chip .remove-button') as HTMLElement).click();
      render();
      expect(host.control.value).toEqual([OPTIONS[1]]);
    }));

    it('clears the selection', fakeAsync(() => {
      host.control.setValue([OPTIONS[0]]);
      render();
      (el().querySelector('.ng-jvx-multiselect__remove-button') as HTMLElement).click();
      render();
      expect(host.control.value).toEqual([]);
      expect(el().textContent).toContain('Pick');
    }));

    it('filters options with the client search', fakeAsync(() => {
      host.searchInput = true;
      host.searchMode = 'client';
      render();
      open();
      const input = overlay().querySelector('.search-input-container input') as HTMLInputElement;
      input.value = 'le';
      input.dispatchEvent(new Event('input'));
      tick(300);
      render();
      expect(optionTexts()).toEqual(['Lemon', 'Apple']);

      closeWithBackdrop();
      open();
      expect(optionTexts().length).toBe(3);
      closeWithBackdrop();
    }));

    it('closes on Escape', fakeAsync(() => {
      render();
      open();
      overlay().querySelector('.ng-jvx-panel')!.dispatchEvent(new KeyboardEvent('keydown', {key: 'Escape', bubbles: true}));
      render();
      tick(ANIMATION);
      render();
      expect(options().length).toBe(0);
    }));

    it('opens with the keyboard', fakeAsync(() => {
      render();
      trigger().dispatchEvent(new KeyboardEvent('keydown', {key: 'Enter'}));
      render();
      tick(ANIMATION);
      render();
      expect(options().length).toBe(3);
      closeWithBackdrop();
    }));
  });

  describe('forms integration', () => {
    it('writes the control value without emitting valueChange', fakeAsync(() => {
      render();
      host.control.setValue([OPTIONS[2]]);
      render();
      expect(trigger().textContent).toContain('Apple');
      expect(host.changes.length).toBe(0);
    }));

    it('marks the control as touched when the panel closes', fakeAsync(() => {
      render();
      expect(host.control.touched).toBeFalse();
      open();
      closeWithBackdrop();
      expect(host.control.touched).toBeTrue();
    }));

    it('does not open while disabled', fakeAsync(() => {
      host.control.disable();
      render();
      trigger().click();
      render();
      tick(ANIMATION);
      expect(options().length).toBe(0);
      expect(trigger().getAttribute('tabindex')).toBe('-1');
      expect(host.select().disabled).toBeTrue();
    }));
  });

  describe('remote options', () => {
    beforeEach(() => {
      host.url = '/api/options';
      host.options = [];
    });

    it('loads the first page before opening and the next ones on scroll end', fakeAsync(() => {
      host.multi = true;
      render();
      trigger().click();
      render();
      expect(host.select().isLoading()).toBeTrue();
      expect(options().length).toBe(0);

      const first = http.expectOne(r => r.url === '/api/options');
      expect(first.request.params.get('page')).toBe('1');
      first.flush(page(1, 15, 30));
      render();
      tick(ANIMATION);
      render();
      expect(options().length).toBe(15);
      expect(host.select().totalRows()).toBe(30);
      expect(host.select().totalPages()).toBe(2);

      const scroller = overlay().querySelector('.ng-jvx-options-scroller') as HTMLElement;
      scroller.scrollTop = scroller.scrollHeight;
      scroller.dispatchEvent(new Event('scroll'));
      render();
      const second = http.expectOne(r => r.url === '/api/options');
      expect(second.request.params.get('page')).toBe('2');
      second.flush(page(16, 15, 30));
      render();
      expect(options().length).toBe(30);
      expect(host.events).toContain('scrollEnd');

      // last page reached: no further request
      scroller.scrollTop = scroller.scrollHeight;
      scroller.dispatchEvent(new Event('scroll'));
      render();
      http.expectNone(r => r.url === '/api/options');
      closeWithBackdrop();
    }));

    it('sends the search to the server and restarts from the first page', fakeAsync(() => {
      host.searchInput = true;
      render();
      trigger().click();
      render();
      http.expectOne(r => r.url === '/api/options').flush(page(1, 15, 200));
      render();
      tick(ANIMATION);
      render();

      const input = overlay().querySelector('.search-input-container input') as HTMLInputElement;
      input.value = '19';
      input.dispatchEvent(new Event('input'));
      tick(300);
      render();
      const search = http.expectOne(r => r.url === '/api/options');
      expect(search.request.params.get('search')).toBe('19');
      expect(search.request.params.get('page')).toBe('1');
      search.flush({data: [{value: 19, text: 'value 19'}], pagingInfo: {pageNo: 1, pageCount: 1, totalRecordCount: 1}});
      render();
      expect(optionTexts()).toEqual(['value 19']);
      closeWithBackdrop();
    }));

    it('reloads from the first page with a new url without closing, keeping the applied search', fakeAsync(() => {
      host.searchInput = true;
      render();
      open();
      http.expectOne(r => r.url === '/api/options').flush(page(1, 15, 200));
      render();
      tick(ANIMATION);
      render();
      const input = overlay().querySelector('.search-input-container input') as HTMLInputElement;
      input.value = '19';
      input.dispatchEvent(new Event('input'));
      tick(300);
      render();
      http.expectOne(r => r.url === '/api/options').flush(page(1, 15, 200));
      render();
      host.events = [];

      host.select().reload('/api/other');
      render();
      const reload = http.expectOne(r => r.url === '/api/other');
      expect(reload.request.params.get('page')).toBe('1');
      expect(reload.request.params.get('search')).toBe('19');
      reload.flush({data: [{value: 99, text: 'other 99'}], pagingInfo: {pageNo: 1, pageCount: 1, totalRecordCount: 1}});
      render();

      expect(optionTexts()).toEqual(['other 99']);
      expect(host.select().isOpen()).toBeTrue();
      expect(host.events).toEqual([]);
      closeWithBackdrop();
    }));

    it('reloads with the new url while the first page is still loading, then opens', fakeAsync(() => {
      render();
      trigger().click();
      render();
      const stale = http.expectOne(r => r.url === '/api/options');

      host.select().reload('/api/other');
      render();
      expect(stale.cancelled).toBeTrue();
      http.expectOne(r => r.url === '/api/other').flush(page(1, 3, 3));
      render();
      tick(ANIMATION);
      render();

      expect(host.select().isOpen()).toBeTrue();
      expect(options().length).toBe(3);
      closeWithBackdrop();
    }));

    it('only stores the url when reloaded while closed, and uses it at the next opening', fakeAsync(() => {
      render();
      host.select().reload('/api/other');
      render();
      http.expectNone(() => true);

      trigger().click();
      render();
      http.expectOne(r => r.url === '/api/other').flush(page(1, 3, 3));
      render();
      tick(ANIMATION);
      render();
      expect(options().length).toBe(3);
      closeWithBackdrop();
    }));

    it('emits loadError and stops loading when the request fails', fakeAsync(() => {
      render();
      trigger().click();
      render();
      http.expectOne(r => r.url === '/api/options').flush('boom', {status: 500, statusText: 'Server Error'});
      render();
      expect(host.errors.length).toBe(1);
      expect(host.select().isLoading()).toBeFalse();
      expect(options().length).toBe(0);
      flush();
      discardPeriodicTasks();
    }));
  });
});

@Component({
  imports: [NgJvxMultiselectComponent, NgJvxOptionComponent, NgJvxMultisectChipComponent, NgJvxSelectionTemplateDirective],
  template: `
    <ng-jvx-multiselect [multi]="true" [(value)]="value">
      <ng-jvx-option [value]="1">One</ng-jvx-option>
      <ng-jvx-option [value]="2">Two</ng-jvx-option>
      <ng-container *ngJvxSelectionTemplate="let selection">
        @for (s of selection; track s.value) {
          <ng-jvx-multiselect-chip [value]="s" (removed)="removed.push($event)">{{ s.text }}</ng-jvx-multiselect-chip>
        }
      </ng-container>
    </ng-jvx-multiselect>
  `
})
class SlotHostComponent {
  value: { value: number, text: string }[] = [];
  removed: unknown[] = [];
}

describe('NgJvxMultiselectComponent default slot and templates', () => {
  let fixture: ComponentFixture<SlotHostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({imports: [SlotHostComponent], providers: [provideHttpClient()]});
    fixture = TestBed.createComponent(SlotHostComponent);
  });

  afterEach(() => document.querySelectorAll('.cdk-overlay-container').forEach(c => c.innerHTML = ''));

  it('selects options declared with <ng-jvx-option> and removes them through custom chips', fakeAsync(() => {
    fixture.detectChanges();
    (fixture.nativeElement.querySelector('[role=combobox]') as HTMLElement).click();
    fixture.detectChanges();
    tick(ANIMATION);
    fixture.detectChanges();

    const two = Array.from(document.querySelectorAll('.cdk-overlay-container ng-jvx-option'))
      .find(o => o.textContent!.trim() === 'Two')!;
    (two.querySelector('.ng-jvx-option') as HTMLElement).click();
    fixture.detectChanges();
    expect(fixture.componentInstance.value).toEqual([{value: 2, text: 'Two'}]);
    expect(two.getAttribute('aria-selected')).toBe('true');

    (document.querySelector('.ng-jvx-panel-overlay') as HTMLElement).click();
    fixture.detectChanges();
    tick(ANIMATION);
    fixture.detectChanges();

    (fixture.nativeElement.querySelector('ng-jvx-multiselect-chip .remove-button') as HTMLElement).click();
    fixture.detectChanges();
    expect(fixture.componentInstance.removed).toEqual([{value: 2, text: 'Two'}]);
    expect(fixture.componentInstance.value).toEqual([]);
  }));
});
