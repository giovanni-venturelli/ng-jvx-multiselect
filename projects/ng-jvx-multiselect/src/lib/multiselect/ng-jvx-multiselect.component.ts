import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  ContentChild,
  contentChildren,
  DestroyRef,
  effect,
  ElementRef,
  EventEmitter,
  forwardRef,
  inject,
  Input,
  input,
  Output,
  signal,
  viewChild,
  ViewEncapsulation
} from '@angular/core';
import {NgTemplateOutlet} from '@angular/common';
import {takeUntilDestroyed, toObservable, toSignal} from '@angular/core/rxjs-interop';
import {ControlValueAccessor, NgControl} from '@angular/forms';
import {HttpHeaders} from '@angular/common/http';
import {coerceBooleanProperty} from '@angular/cdk/coercion';
import {EMPTY, forkJoin, merge, Observable, of, Subject} from 'rxjs';
import {catchError, debounceTime, filter, finalize, map, switchMap, tap} from 'rxjs/operators';

import {NgJvxMultiselectService} from '../services/ng-jvx-multiselect.service';
import {NgJvxMultiOptionMapper, NgJvxOptionMapper} from '../interfaces/ng-jvx-option-mapper';
import {NgJvxSearchMapper} from '../interfaces/ng-jvx-search-mapper';
import {NgJvxGroupMapper} from '../interfaces/ng-jvx-group-mapper';
import {NgJvxOptionsTemplateDirective} from '../directives/ng-jvx-options-template.directive';
import {NgJvxSelectionTemplateDirective} from '../directives/ng-jvx-selection-template.directive';
import {NgJvxGroupHeaderDirective} from '../directives/ng-jvx-group-header.directive';
import {NgJvxFocusDirective} from '../directives/ng-jvx-focus.directive';
import {NgJvxScrollEndDirective} from '../directives/ng-jvx-scroll-end.directive';
import {NgJvxOptionComponent} from '../option/ng-jvx-option.component';
import {NgJvxMultisectChipComponent} from '../chip/ng-jvx-multiselect-chip.component';
import {PanelComponent} from '../panel/panel.component';
import {OptionListComponent} from './option-list/option-list.component';
import {
  DEFAULT_PAGINATION_PROP,
  DEFAULT_PAGINATION_RESPONSE,
  DEFAULT_PAGINATION_RESPONSE_PROP,
  MIN_PAGE_SIZE,
  NgJvxOptionGroup,
  NgJvxPaginationProp,
  NgJvxPaginationResponse,
  NgJvxRequestType,
  NgJvxSearchMode
} from '../core/models';
import {NG_JVX_MULTISELECT_CONTAINER, NgJvxMultiselectContainer} from '../core/container';
import {GroupBy, groupOptions, isGroupingEnabled, keyOf, readPath, sameSelection, sortByKey} from '../core/selection';

/** Delay between the last keystroke and the search. */
const SEARCH_DEBOUNCE_MS = 300;

interface LoadRequest {
  /** Start again from the first page, dropping the options loaded so far. */
  reset: boolean;
  /** Open the panel once the page is loaded. */
  open: boolean;
}

/**
 * Select for single and multiple selection, with static options or options loaded from a backend
 * (GET/POST, pagination with infinite scroll, client or server search, grouping and custom templates).
 *
 * The value is always an array of options, in single selection too. The component implements
 * `ControlValueAccessor`, so it works with reactive and template-driven forms.
 */
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ng-jvx-multiselect',
  templateUrl: './ng-jvx-multiselect.component.html',
  styleUrl: './ng-jvx-multiselect.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [
    NgTemplateOutlet,
    PanelComponent,
    OptionListComponent,
    NgJvxMultisectChipComponent,
    NgJvxFocusDirective,
    NgJvxScrollEndDirective
  ],
  providers: [
    {provide: NG_JVX_MULTISELECT_CONTAINER, useExisting: forwardRef(() => NgJvxMultiselectComponent)}
  ],
  host: {
    '[id]': 'id',
    '[class.has-errors]': 'errorState',
    '[class.floating]': 'shouldLabelFloat',
    '(focusin)': 'onFocusIn()',
    '(focusout)': 'onFocusOut($event)'
  }
})
export class NgJvxMultiselectComponent implements ControlValueAccessor, NgJvxMultiselectContainer {
  private static nextId = 0;

  /** Unique id of the host element. */
  readonly id = `jvx-multiselect-${NgJvxMultiselectComponent.nextId++}`;
  readonly controlType = 'ng-jvx-multiselect';

  // -----------------------------------------------------------------------------------------------------
  // @ Dependencies
  // -----------------------------------------------------------------------------------------------------

  readonly ngControl = inject(NgControl, {optional: true, self: true});
  private readonly service = inject(NgJvxMultiselectService);
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);

  // -----------------------------------------------------------------------------------------------------
  // @ State
  // -----------------------------------------------------------------------------------------------------

  private readonly _options = signal<any[]>([]);
  /** Options loaded from the backend so far. */
  private readonly _loaded = signal<any[]>([]);
  /** Options currently shown in the panel. */
  private readonly _selectable = signal<any[]>([]);
  private readonly _selection = signal<any[]>([]);
  private readonly _itemValue = signal('value');
  private readonly _groupBy = signal<GroupBy>(null);
  private readonly _disabled = signal(false);
  private readonly _totalRows = signal(0);
  private readonly _totalPages = signal(0);
  protected readonly searchText = signal('');
  protected readonly panelWidth = signal(0);
  protected readonly closing = signal(false);

  readonly isOpen = signal(false);
  readonly isLoading = signal(false);
  /** Total number of rows reported by the backend (`paginationResponse.totalRows`). */
  readonly totalRows = this._totalRows.asReadonly();
  /** Total number of pages reported by the backend (`paginationResponse.totalPages`). */
  readonly totalPages = this._totalPages.asReadonly();
  /** Whether the component is disabled, as a signal. */
  readonly disabledState = this._disabled.asReadonly();

  /** Last page loaded from the backend (0 before the first load). */
  currentPage = 0;
  /** Emits whenever the state relevant to the host (value, disabled, required...) changes. */
  readonly stateChanges = new Subject<void>();
  focused = false;
  touched = false;

  protected readonly selectedKeys = computed(() => {
    const key = this._itemValue();
    return new Set(this._selection().map(option => keyOf(option, key)));
  });
  protected readonly grouped = computed(() => isGroupingEnabled(this._groupBy()));
  protected readonly groups = toSignal(
    toObservable(computed(() => ({options: this._selectable(), groupBy: this._groupBy()}))).pipe(
      switchMap(({options, groupBy}) => groupOptions(options, groupBy))
    ),
    {initialValue: [] as NgJvxOptionGroup[]}
  );
  /** Options are rendered only while the panel is visible. */
  protected readonly panelRendered = computed(() => this.isOpen() || this.closing());

  private appliedSearch = '';
  private hasMorePages = true;
  private _required = false;
  private _pageSize = MIN_PAGE_SIZE;
  private _optionsInput: any[] = [];
  private readonly searchInput$ = new Subject<string>();
  private readonly loadRequests = new Subject<LoadRequest>();
  private readonly filterRequests = new Subject<void>();
  private onChange: (value: any[]) => void = () => {
  };
  public onTouched: () => void = () => {
  };

  // -----------------------------------------------------------------------------------------------------
  // @ Queries
  // -----------------------------------------------------------------------------------------------------

  @ContentChild(NgJvxOptionsTemplateDirective) optionsTemplate: NgJvxOptionsTemplateDirective | null = null;
  @ContentChild(NgJvxSelectionTemplateDirective) selectionTemplate: NgJvxSelectionTemplateDirective | null = null;
  @ContentChild(NgJvxGroupHeaderDirective) groupHeaderTemplate: NgJvxGroupHeaderDirective | null = null;
  /** `<ng-jvx-option>` elements declared in the default slot. */
  private readonly projectedOptions = contentChildren(NgJvxOptionComponent, {descendants: true});
  private readonly panel = viewChild.required(PanelComponent);
  private readonly jvxMultiselect = viewChild.required<ElementRef<HTMLElement>>('jvxMultiselect');
  private readonly optionScroller = viewChild<ElementRef<HTMLElement>>('optionScroller');

  // -----------------------------------------------------------------------------------------------------
  // @ Inputs
  // -----------------------------------------------------------------------------------------------------

  /** Static options. */
  @Input() set options(options: any[] | null | undefined) {
    this._optionsInput = options;
    this._options.set(options ? [...options] : []);
    this.filterRequests.next();
  }

  get options(): any[] {
    return this._optionsInput;
  }

  /** Selected options. Always an array, also in single selection. */
  @Input() set value(value: any[] | null | undefined) {
    if (!sameSelection(value, this._selection(), this.itemValue)) {
      this._selection.set(value ? [...value] : []);
      this.stateChanges.next();
    }
  }

  get value(): any[] {
    return this._selection();
  }

  @Input() set itemValue(key: string) {
    this._itemValue.set(key);
  }

  get itemValue(): string {
    return this._itemValue();
  }

  @Input() itemText = 'text';
  @Input() multi = false;

  @Input() set disabled(disabled: boolean) {
    this.setDisabledState(coerceBooleanProperty(disabled));
  }

  get disabled(): boolean {
    return this._disabled();
  }

  @Input() set required(required: boolean) {
    this._required = coerceBooleanProperty(required);
    this.stateChanges.next();
  }

  get required(): boolean {
    return this._required;
  }

  @Input() clearable = false;
  @Input() closeOnClick = true;
  @Input() closeButton = true;
  @Input() hasErrors = false;
  @Input() panelClass = '';

  /** Groups the options by a property name or through a {@link NgJvxGroupMapper}. */
  @Input() set groupBy(groupBy: NgJvxGroupMapper<any> | string | null) {
    this._groupBy.set(groupBy);
  }

  get groupBy(): NgJvxGroupMapper<any> | string | null {
    return this._groupBy() ?? null;
  }

  // Search
  @Input() searchInput = false;
  @Input() searchMode: NgJvxSearchMode = null;
  @Input() searchLabel = 'search';
  @Input() searchProp = 'search';
  @Input() searchMapper: NgJvxSearchMapper<any> = {
    mapSearch: (search: string, options: any[]): Observable<any[]> => {
      const term = String(search ?? '').toLowerCase();
      return of(options.filter(o => String(readPath(o, this.itemText) ?? '').toLowerCase().includes(term)));
    }
  };

  // Remote options
  @Input() url = '';
  @Input() requestType: NgJvxRequestType = 'get';
  @Input() requestHeaders: HttpHeaders = new HttpHeaders();
  @Input() listProp = '';
  @Input() ignorePagination = false;

  /** Size of a page; values below 15 are raised to 15. */
  @Input() set pageSize(size: number) {
    this._pageSize = Math.max(MIN_PAGE_SIZE, Number(size) || MIN_PAGE_SIZE);
  }

  get pageSize(): number {
    return this._pageSize;
  }

  @Input() mapper: NgJvxOptionMapper<any> = {
    mapOption: (source: any): Observable<any> => of(source)
  };
  @Input() multiMapper: NgJvxMultiOptionMapper<any> = {
    mapOptions: (source: any): Observable<any> => of(source)
  };

  /** Extra properties merged into the body of POST requests. */
  readonly postPayload = input<object>();
  readonly paginationProp = input<NgJvxPaginationProp>(DEFAULT_PAGINATION_PROP);
  readonly paginationResponse = input<NgJvxPaginationResponse>(DEFAULT_PAGINATION_RESPONSE);
  readonly paginationResponseProp = input<string>(DEFAULT_PAGINATION_RESPONSE_PROP);

  // -----------------------------------------------------------------------------------------------------
  // @ Outputs
  // -----------------------------------------------------------------------------------------------------

  @Output() readonly valueChange = new EventEmitter<any[]>();
  /** The panel starts opening. */
  @Output() readonly jvxMultiselectOpen = new EventEmitter<void>();
  /** The panel is open. */
  @Output() readonly jvxMultiselectOpened = new EventEmitter<void>();
  /** The panel starts closing. */
  @Output() readonly jvxMultiselectClose = new EventEmitter<void>();
  /** The panel is closed. */
  @Output() readonly jvxMultiselectClosed = new EventEmitter<void>();
  /** The option list has been scrolled to the bottom. */
  @Output() readonly scrollEnd = new EventEmitter<void>();
  /** A remote request failed. */
  @Output() readonly loadError = new EventEmitter<unknown>();

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle
  // -----------------------------------------------------------------------------------------------------

  constructor() {
    if (this.ngControl) {
      // Set here instead of through NG_VALUE_ACCESSOR to be able to read the control state (errorState).
      this.ngControl.valueAccessor = this;
    }

    this.filterRequests.pipe(
      switchMap(() => this.filteredOptions()),
      takeUntilDestroyed()
    ).subscribe(options => this._selectable.set(options));

    this.loadRequests.pipe(
      switchMap(request => this.loadPage(request)),
      takeUntilDestroyed()
    ).subscribe();

    this.searchInput$.pipe(
      debounceTime(SEARCH_DEBOUNCE_MS),
      filter(term => term !== this.appliedSearch),
      takeUntilDestroyed()
    ).subscribe(term => this.applySearch(term));

    this.syncProjectedOptions();
    this.destroyRef.onDestroy(() => this.stateChanges.complete());
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  get errorState(): boolean {
    return !!this.ngControl?.invalid && !!this.ngControl?.touched;
  }

  get empty(): boolean {
    return this._selection().length === 0;
  }

  get shouldLabelFloat(): boolean {
    return this.focused || this.isOpen() || !this.empty;
  }

  /** Options currently shown in the panel. */
  get selectableOptions(): any[] {
    return this._selectable();
  }

  /** Options grouped by `groupBy`, as shown in the panel. */
  get orderedOptions(): NgJvxOptionGroup[] {
    return this.groups();
  }

  /** Search text currently applied. */
  get searchValue(): string {
    return this.appliedSearch;
  }

  // -----------------------------------------------------------------------------------------------------
  // @ ControlValueAccessor
  // -----------------------------------------------------------------------------------------------------

  writeValue(value: any[] | null): void {
    this.value = value;
    this.changeDetectorRef.markForCheck();
  }

  registerOnChange(fn: (value: any[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this._disabled.set(isDisabled);
    if (isDisabled) {
      this.closeMenu();
    }
    this.stateChanges.next();
    this.changeDetectorRef.markForCheck();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public API
  // -----------------------------------------------------------------------------------------------------

  /** Opens the panel, loading the first page first when an `url` is set. */
  openMenu(): void {
    if (this._disabled() || this.isLoading() || this.isOpen()) {
      return;
    }
    if (this.url) {
      this.loadRequests.next({reset: true, open: true});
    } else {
      this.openPanel();
    }
  }

  /** Closes the panel. */
  closeMenu(): void {
    if (!this.isOpen()) {
      return;
    }
    this.isOpen.set(false);
    this.closing.set(true);
    this.jvxMultiselectClose.emit();
    this.markAsTouched();
    this.panel().close();
  }

  select(option: any): void {
    const key = this.itemValue;
    const next = this.multi
      ? sortByKey([...this._selection().filter(o => keyOf(o, key) !== keyOf(option, key)), option], key)
      : [option];
    this.commit(next);
  }

  deselect(option: any): void {
    const key = keyOf(option, this.itemValue);
    this.commit(this._selection().filter(o => keyOf(o, this.itemValue) !== key));
  }

  /** Empties the selection. */
  clear(event?: Event): void {
    event?.stopPropagation();
    event?.preventDefault();
    this.commit([]);
  }

  isOptionSelected(option: any): boolean {
    return this.selectedKeys().has(keyOf(option, this.itemValue));
  }

  /** Toggles an option; in single selection with `closeOnClick` it also closes the panel. */
  clickOnOption(option: any): void {
    this.isOptionSelected(option) ? this.deselect(option) : this.select(option);
    if (!this.multi && this.closeOnClick) {
      this.closeMenu();
    }
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Template handlers
  // -----------------------------------------------------------------------------------------------------

  clickOnMenuTrigger(event?: Event): void {
    event?.preventDefault();
    this.openMenu();
  }

  protected onTriggerKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowDown') {
      event.preventDefault();
      this.openMenu();
    }
  }

  onSearchValueChange(event: Event): void {
    const term = (event.target as HTMLInputElement).value;
    this.searchText.set(term);
    this.searchInput$.next(term);
  }

  onFocusIn(): void {
    if (!this.focused) {
      this.focused = true;
      this.stateChanges.next();
    }
  }

  onFocusOut(event: FocusEvent): void {
    if (!this.elementRef.nativeElement.contains(event.relatedTarget as Node | null)) {
      this.focused = false;
      if (!this.isOpen()) {
        this.markAsTouched();
      }
      this.stateChanges.next();
    }
  }

  protected onReachedBottom(): void {
    this.scrollEnd.emit();
    if (this.url && !this.ignorePagination && this.hasMorePages && !this.isLoading()) {
      this.loadRequests.next({reset: false, open: false});
    }
  }

  protected onPanelOpened(): void {
    this.jvxMultiselectOpened.emit();
  }

  protected onPanelClosed(): void {
    this.closing.set(false);
    this.resetSearch();
    this.jvxMultiselectClosed.emit();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Private
  // -----------------------------------------------------------------------------------------------------

  private openPanel(): void {
    this.panelWidth.set(this.jvxMultiselect().nativeElement.offsetWidth);
    this.isOpen.set(true);
    this.jvxMultiselectOpen.emit();
    this.panel().open();
  }

  private commit(selection: any[]): void {
    this._selection.set(selection);
    this.valueChange.emit(selection);
    this.onChange(selection);
    this.stateChanges.next();
  }

  private markAsTouched(): void {
    this.touched = true;
    this.onTouched();
    this.ngControl?.control?.markAsTouched();
  }

  private applySearch(term: string): void {
    this.appliedSearch = term;
    this.scrollToTop();
    if (this.searchMode === 'client') {
      this.filterRequests.next();
    } else if (this.url) {
      this.loadRequests.next({reset: true, open: false});
    }
  }

  private scrollToTop(): void {
    const scroller = this.optionScroller()?.nativeElement;
    if (scroller) {
      scroller.scrollTop = 0;
    }
  }

  private resetSearch(): void {
    this.searchText.set('');
    if (this.appliedSearch !== '') {
      this.appliedSearch = '';
      this.filterRequests.next();
    }
    this.currentPage = 0;
  }

  /** Options to show: the source (static or loaded) filtered by the client search, if any. */
  private filteredOptions(): Observable<any[]> {
    const source = this.url ? this._loaded() : this._options();
    if (this.searchMode === 'client' && this.appliedSearch) {
      return this.searchMapper.mapSearch(this.appliedSearch, source).pipe(map(options => [...(options ?? [])]));
    }
    return of(source);
  }

  private loadPage({reset, open}: LoadRequest): Observable<unknown> {
    if (reset) {
      this.currentPage = 0;
      this.hasMorePages = true;
      this._loaded.set([]);
      this._totalRows.set(0);
      this._totalPages.set(0);
      this.filterRequests.next();
    }
    if (!this.hasMorePages) {
      return EMPTY;
    }
    const page = this.currentPage + 1;
    this.isLoading.set(true);

    return this.service.getList({
      url: this.url,
      requestType: this.requestType,
      requestHeaders: this.requestHeaders,
      data: this.postPayload() ?? {},
      currentPage: page,
      pageSize: this._pageSize,
      ignorePagination: this.ignorePagination,
      search: this.searchMode === 'client' ? '' : this.appliedSearch,
      searchProp: this.searchProp,
      paginationProp: this.paginationProp(),
      paginationResponse: this.paginationResponse()
    }).pipe(
      switchMap(response => this.multiMapper.mapOptions(response ?? [])),
      map(response => this.readPage(response)),
      switchMap(items => items.length ? forkJoin(items.map(item => this.mapper.mapOption(item))) : of([])),
      tap(options => {
        this.currentPage = page;
        this.hasMorePages = !this.ignorePagination &&
          (this._totalPages() > 0 ? page < this._totalPages() : options.length > 0);
        this._loaded.update(loaded => [...loaded, ...options]);
        this.filterRequests.next();
        if (open && !this.isOpen()) {
          this.openPanel();
        }
      }),
      catchError(error => {
        this.loadError.emit(error);
        return EMPTY;
      }),
      finalize(() => this.isLoading.set(false))
    );
  }

  /** Extracts the list and the pagination info from a (multi-mapped) response. */
  private readPage(response: any): any[] {
    if (!response) {
      return [];
    }
    if (!this.listProp) {
      return Array.isArray(response) ? response : [];
    }
    const paging = readPath(response, this.paginationResponseProp());
    if (paging) {
      const names = this.paginationResponse();
      const totalRows = Number(readPath(paging, names.totalRows));
      const totalPages = Number(readPath(paging, names.totalPages));
      if (Number.isFinite(totalRows)) {
        this._totalRows.set(totalRows);
      }
      if (Number.isFinite(totalPages)) {
        this._totalPages.set(totalPages);
      }
    }
    const list = readPath(response, this.listProp);
    return Array.isArray(list) ? list : [];
  }

  /** Keeps the `<ng-jvx-option>` elements of the default slot in sync with the selection and listens to their clicks. */
  private syncProjectedOptions(): void {
    effect(() => {
      const keys = this.selectedKeys();
      for (const option of this.projectedOptions()) {
        option.selectedByParent.set(keys.has(keyOf(option.value(), this._itemValue())));
      }
    });

    toObservable(this.projectedOptions).pipe(
      switchMap(options => merge(...options.map(option => option.clickOnOption.pipe(map(() => option))))),
      takeUntilDestroyed()
    ).subscribe(option => this.clickOnOption(this.projectedOptionValue(option)));
  }

  private projectedOptionValue(option: NgJvxOptionComponent): any {
    const value = option.value();
    return value !== null && typeof value === 'object'
      ? value
      : {[this.itemValue]: value, [this.itemText]: option.label};
  }
}
