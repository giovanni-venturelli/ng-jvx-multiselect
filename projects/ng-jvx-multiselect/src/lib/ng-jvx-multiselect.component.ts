import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component, computed,
  ContentChild, DoCheck,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostBinding, input,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  QueryList,
  Self, Signal, signal,
  SimpleChanges, viewChild,
  ViewChild,
  ViewChildren,
  ViewEncapsulation
} from '@angular/core';
import {NgJvxOptionsTemplateDirective} from './directives/ng-jvx-options-template.directive';
import {ControlValueAccessor, NgControl, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup} from '@angular/forms';
import {NgJvxOptionComponent} from './ng-jvx-option/ng-jvx-option.component';
import {NgJvxMultiselectService} from './ng-jvx-multiselect.service';
import {HttpHeaders} from '@angular/common/http';
import {NgScrollbar} from 'ngx-scrollbar';
import {catchError, debounceTime, distinctUntilChanged, map, startWith, switchMap, takeUntil, tap, throttleTime} from 'rxjs/operators';
import {BehaviorSubject, forkJoin, fromEvent, interval, lastValueFrom, noop, Observable, of, Subject, throwError, timer} from 'rxjs';
import {NgJvxMultiOptionMapper, NgJvxOptionMapper} from './interfaces/ng-jvx-option-mapper';
import {NgJvxSelectionTemplateDirective} from './directives/ng-jvx-selection-template.directive';
import {coerceBooleanProperty} from '@angular/cdk/coercion';
import {NgJvxGroupHeaderDirective} from './directives/ng-jvx-group-header.directive';
import {NgJvxSearchMapper} from './interfaces/ng-jvx-search-mapper';
import {NgJvxGroup, NgJvxGroupMapper} from './interfaces/ng-jvx-group-mapper';
import {MenuTriggerDirective} from './panel/menu-trigger/menu-trigger.directive';
import {toSignal} from '@angular/core/rxjs-interop';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ng-jvx-multiselect',
  templateUrl: './ng-jvx-multiselect.component.html',
  styleUrls: ['./ng-jvx-multiselect.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    // {
    //   provide: MatFormFieldControl,
    //   useExisting: forwardRef(() => NgJvxMultiselectComponent),
    //   multi: true,
    // }
  ],
  standalone: false
})
export class NgJvxMultiselectComponent implements OnInit, OnDestroy, AfterViewInit,
  ControlValueAccessor {
  static nextId = 0;
  @HostBinding() id = `jvx-multiselect-${NgJvxMultiselectComponent.nextId++}`;

  @HostBinding('class.floating')
  get shouldLabelFloat(): boolean {
    return this.focused || !this.empty || this.value.length > 0 || !!this.isPlaceholderActive;
  }

  jvxMultiselect = viewChild.required<ElementRef>('jvxMultiselect');
  @ViewChild('valueContainer', {static: true}) valueContainer: ElementRef;
  selectionContainer = viewChild.required<ElementRef>('selectionContainer');
  menuFooter = viewChild<ElementRef>('menuFooter');
  // @ViewChild('selection', {static: true}) selection: MatSelectionList;
  @ViewChild(MenuTriggerDirective, {static: true}) trigger: MenuTriggerDirective;
  @ViewChild('scrollbar', {static: false}) scrollbar: NgScrollbar;
  multiContainer = viewChild.required<ElementRef>('multiContainer');
  @ViewChild('placeholderContainer', {static: false}) placeholderContainer: ElementRef;
  @ViewChildren(NgJvxOptionComponent) optionComp: QueryList<NgJvxOptionComponent>;
  @ContentChild(NgJvxOptionsTemplateDirective) optionsTemplate: NgJvxOptionsTemplateDirective | null = null;
  @ContentChild(NgJvxSelectionTemplateDirective) selectionTemplate: NgJvxSelectionTemplateDirective | null = null;
  @ContentChild(NgJvxGroupHeaderDirective) groupHeaderTemplate: NgJvxGroupHeaderDirective | null = null;
  // @ContentChild(NgJvxOptionComponent) optionComp: NgJvxOptionComponent;
  // @ContentChild(TemplateRef) optionsTemplate: TemplateRef<any> | null = null;
  @Input() set options(v: any[]) {
    if (v) {
      this.selectableOptions = [...v];
    } else {
      this.selectableOptions = [];
    }
    this._options = v;
  }

  get options(): any[] {
    return this._options;
  }

  @Input() multi = false;
  @Input() url = '';
  @Input() requestType: 'get' | 'post' = 'get';
  @Input() itemValue = 'value';
  @Input() itemText = 'text';
  @Input() ignorePagination = false;
  @Input() clearable = false;
  @Input() closeOnClick = true;
  @Input() hasErrors = false;
  @Input() searchMode: null | 'server' | 'client' = null;
  @Input() searchInput = false;
  @Input() searchLabel = 'search';
  @Input() listProp = '';
  @Input() totalRowsProp = '';
  @Input() panelClass = '';
  @Input() searchProp = 'search';
  @Input() closeButton = false;
  @Input() mapper: NgJvxOptionMapper<any> = {
    mapOption(source: any): Observable<any> {
      return of(source);
    }
  };
  @Input() multiMapper: NgJvxMultiOptionMapper<any> = {
    mapOptions(source: any[]): Observable<any> {
      return of(source);
    }
  };
  @Input() searchMapper: NgJvxSearchMapper<any> = {
    mapSearch: (source: string, options: any[]): Observable<any> => {
      return of(options.filter(o => o[this.itemText].toString().toLowerCase().includes(source.toString().toLowerCase())));
    }
  };
  @Input() groupBy: NgJvxGroupMapper<any> | string | null;

  @Input() set value(value: any[]) {
    if (!this.areArraysEqual(value, this.pValue)) {
      this.pValue = value ?? [];
      this.showList = !this.showList;
      if (value) {
        this.form.get('selectionValue').setValue(this.pValue.map(v => v[this.itemValue]));
      } else {
        this.form.get('selectionValue').setValue(value);
      }
      this.changeDetectorRef.detectChanges();
      this.showList = !this.showList;
      this.stateChanges.next();
    }
  }

  get value(): any[] {
    return this.pValue;
  }

  @Input() requestHeaders: HttpHeaders = new HttpHeaders();

  @Input()
  get required(): boolean {
    return this._required;
  }

  set required(req) {
    this._required = coerceBooleanProperty(req);
    this.stateChanges.next();
  }

  postPayload = input<object>();
  // tslint:disable-next-line:variable-name
  private _required = false;
  private _jvxWidth = signal(0);

  @Input()
  get disabled(): boolean {
    return this._disabled;
  }

  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
    this._disabled ? this.parts.disable() : this.parts.enable();
    this.stateChanges.next();
  }

  @Input()
  get pageSize(): number {
    return this.intPageSize;
  }

  set pageSize(val: number) {
    if (val < 15) {
      this.intPageSize = 15;
    } else {
      this.intPageSize = val;
    }
  }

  // tslint:disable-next-line:variable-name
  private _disabled = false;

  get errorState(): boolean {
    if (this.ngControl != null) {
      return this.ngControl.invalid && this.ngControl.touched;
    } else {
      return false;
    }
  }

  @Output() valueChange: EventEmitter<any[]> = new EventEmitter<any[]>();
  @Output() jvxMultiselectOpen: EventEmitter<void> = new EventEmitter<void>();
  @Output() jvxMultiselectOpened: EventEmitter<void> = new EventEmitter<void>();
  @Output() jvxMultiselectClose: EventEmitter<void> = new EventEmitter<void>();
  @Output() jvxMultiselectClosed: EventEmitter<void> = new EventEmitter<void>();
  @Output() scrollEnd: EventEmitter<void> = new EventEmitter<void>();
  private _options = [];
  public controlType = 'ng-jvx-multiselect';
  public document = document;
  public window = window;
  public form: UntypedFormGroup;
  public isOpen = signal(false);
  public isLoading = false;
  public showList = true;
  public asyncOptions: any = [];
  public selectableOptions = [];
  public orderedOptions: { group: any, options: any[] }[] = [];
  public searchValue = '';
  public yPosition: Signal<'above' | 'below'> = toSignal(timer(0).pipe(switchMap(() =>
    fromEvent(window, 'resize').pipe(
      map(() => {
        return window.innerHeight - this.jvxMultiselect()?.nativeElement?.getBoundingClientRect()?.top < 300 ? 'above' : 'below';
      }),
      startWith(window.innerHeight - this.jvxMultiselect()?.nativeElement?.getBoundingClientRect()?.top < 300 ? 'above' : 'below'))))
  ) as Signal<'above' | 'below'>;

  public stateChanges = new Subject<void>();
  public currentPage = 0;

  public listContainerSize = computed(() => {
    if (this.isOpen() && this.menuFooter() && this.menuFooter().nativeElement) {
      return {
        height: this.selectionContainer().nativeElement.offsetHeight > 300 ? '300px' : 'auto',
        minHeight: this.selectionContainer().nativeElement.offsetHeight <= 300 ?
          this.selectionContainer().nativeElement.offsetHeight + 'px' : '300px',
        width: this._jvxWidth() + 'px'
      };
    } else {
      return {
        height: 'auto',
        minHeight: '300px',
        width: this._jvxWidth() + 'px'
      };
    }
  });
  public parts: UntypedFormGroup;

  public touched = false;

  public placeholder: string;
  public focused = false;
  public multiContainerWidth = computed(() => {
    return this.multiContainer()?.nativeElement?.offsetWidth ?? 100;
  });
  private isPlaceholderActiveSubject = new BehaviorSubject<boolean>(false);
  private isPlaceholderActive = false;
  private searchValueSubject = new Subject<string>();
  private searchValue$ = this.searchValueSubject.asObservable();
  private pValue: any[] = [];
  private shouldLoadMore = true;
  private unsubscribe = new Subject<void>();
  private unsubscribe$ = this.unsubscribe.asObservable();
  private intPageSize = 15;
  public onTouched = () => {
  }


  constructor(private formBuilder: UntypedFormBuilder, private service: NgJvxMultiselectService,
              private elementRef: ElementRef,
              private changeDetectorRef: ChangeDetectorRef,
              @Optional() @Self() public ngControl: NgControl, fb: UntypedFormBuilder) {
    if (this.ngControl != null) {
      // Setting the value accessor directly (instead of using
      // the providers) to avoid running into a circular import.
      this.ngControl.valueAccessor = this;
    }
    this.isPlaceholderActiveSubject.pipe(takeUntil(this.unsubscribe), debounceTime(0)).subscribe((v) => {
      this.isPlaceholderActive = v;
      this.stateChanges.next();
    });
    this.parts = fb.group({
      area: '',
      exchange: '',
      subscriber: '',
    });
    this.form = this.formBuilder.group({
      selectionValue: new UntypedFormControl(this.selectionValue)
    });
  }

  // ngDoCheck(): void {
  //   this.isPlaceholderActiveSubject.next(this.placeholderContainer?.nativeElement?.hasChildNodes());
  // }

  ngOnInit(): void {
    this.stateChange$.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
      this.changeDetectorRef.markForCheck();
    });
    // this.setSelectableOptions(this.options).subscribe(noop);
    this.selectableOptions = [...this.options];
    this.updateOrderedOptions(this.selectableOptions).subscribe(noop);

    this.searchValue$.pipe(takeUntil(this.unsubscribe), debounceTime(300), distinctUntilChanged((prev, curr) => {
        return curr === this.searchValue;
      }), switchMap((val: string) => {
          this.searchValue = val;
          this.currentPage = 0;
          if (this.searchMode === 'client') {
            return this.clientSearch();
          } else if (this.url && this.url.length > 0) {
            return this.serverSearch();
          }
        }
      )
    ).subscribe((val: any[]) => {
      this.changeDetectorRef.markForCheck();
    });
  }

  private areArraysEqual(arr1: any[] | null, arr2: any[] | null): boolean {
    // Se entrambi sono null o undefined, sono uguali
    if (!arr1 && !arr2) {
      return true;
    }
    // Se solo uno dei due è null/undefined, sono diversi
    if (!arr1 || !arr2) {
      return false;
    }
    // Se hanno lunghezza diversa, sono diversi
    if (arr1.length !== arr2.length) {
      return false;
    }

    // Verifica che ogni elemento di arr1 abbia una corrispondenza in arr2
    return arr1.every(item1 => {
        return arr2.some(item2 => {
          if (typeof item1 === 'object' && item1 !== null) {
            // Se gli elementi sono oggetti, confronta i valori itemValue
            return item1[this.itemValue] === item2[this.itemValue];
          }
          // Altrimenti confronta direttamente i valori
          return item1 === item2;
        });
      }) &&
      // Verifica anche il contrario per assicurarsi che non ci siano elementi extra
      arr2.every(item2 => {
        return arr1.some(item1 => {
          if (typeof item2 === 'object' && item2 !== null) {
            return item2[this.itemValue] === item1[this.itemValue];
          }
          return item2 === item1;
        });
      });
  }

  private clientSearch(): Observable<any> {
    let obs: Observable<any>;
    if (this.url && this.url.length > 0) {
      this.selectableOptions = [];
      this.updateOrderedOptions(this.selectableOptions).subscribe(noop);
      this.shouldLoadMore = true;
      obs = this.getList().pipe(map(() => {
        return this.selectableOptions;
      }));
    } else {
      obs = of(this.options);
    }
    return obs.pipe(switchMap((val) => this.searchMapper.mapSearch(this.searchValue, val)), switchMap((res) => {
        // return this.setSelectableOptions(res);
        this.selectableOptions = [];
        this.selectableOptions.push(...res);
        return this.updateOrderedOptions(this.selectableOptions);
      }
    ));
  }

  private setSelectableOptions(options: any[]): Observable<any> {
    this.selectableOptions = [];
    const obs: Observable<any>[] = options.reduce((acc, curr) => {
      acc.push(this.mapper.mapOption(curr));
      return acc;
    }, []);

    // this.mapper.mapOption(option);

    return forkJoin([...obs]).pipe(switchMap((val) => {
      this.selectableOptions.push(...val);
      return this.updateOrderedOptions(this.selectableOptions);
    }));
  }

  private serverSearch(): Observable<any> {
    this.shouldLoadMore = true;
    this.selectableOptions = [];
    this.shouldLoadMore = true;
    return this.getList();
  }


  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.stateChanges.complete();
  }

  ngAfterViewInit(): void {
    if (this.scrollbar) {
      this.scrollbar.scrolled.pipe(takeUntil(this.unsubscribe$)).subscribe((e: any) => {
        this.onScrolled(e);
      });
    }
    timer(300).pipe(tap(() => {
      this.changeDetectorRef.markForCheck();
    })).subscribe(noop);
  }

  // ngOnChanges(changes: SimpleChanges): void {
  //   if (changes.options) {
  //     // this.setSelectableOptions(this.options).subscribe(noop);
  //     this.selectableOptions = [...this.options];
  //   }
  // }


  get selectionValue(): any[] {
    return this.value.map((v) => {
      return v[this.itemValue];
    });
  }

  get empty(): boolean {
    const n = this.parts.value;
    return !n.area && !n.exchange && !n.subscriber && !this.isPlaceholderActive;
  }

  onCLickOnMenu(e: MouseEvent): void {
    if (this.multi || this.closeOnClick === false) {
      e.stopPropagation();
    }
  }


  private propagateChange(_: any): any {
  }

  // this is the initial value set to the component
  public writeValue(obj: any[]): void {
    this.value = obj;
  }

  // registers 'fn' that will be fired when changes are made
  // this is how we emit the changes back to the form
  public registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  onChange(e: any): void {
    // onChange(e: MatSelectionListChange): void {

    let vals = e.source.selectedOptions.selected.map(o => o.value);
    vals = this.selectableOptions.filter(o => vals.includes(o[this.itemValue]));
    const selectableIds = this.selectableOptions.map(s => s[this.itemValue]);
    if (this.multi) {
      // if search is active, probably some of the already selected values are not included in the selectable options,
      // so we have to push them in the selected values of the list;
      for (const v of this.value) {
        if (!selectableIds.includes(v[this.itemValue])) {
          vals = [v, ...vals];
        }
      }
    }
    vals.sort((a, b) => {
      return typeof a[this.itemValue] === 'string' ?
        a[this.itemValue].localeCompare(b[this.itemValue]) : a[this.itemValue] - b[this.itemValue];
    });
    this.value = [...vals];
    this.form.get('selectionValue').setValue(this.value.map(v => v[this.itemValue]));

    this.valueChange.emit(this.value);
    this.propagateChange(this.value);
    this.changeDetectorRef.markForCheck();
  }


  onFocusIn(event: FocusEvent): void {
    if (!this.focused) {
      this.focused = true;
      this.stateChanges.next();
    }
  }

  onFocusOut(event: FocusEvent): void {
    if (!this.elementRef.nativeElement.contains(event.relatedTarget as Element)) {
      this.touched = true;
      this.focused = false;
      this.onTouched();
      this.stateChanges.next();
    }
  }

  onMenuOpen(): void {
    this._jvxWidth.set(this.jvxMultiselect().nativeElement.offsetWidth);
    this.isOpen.set(true);
    this.jvxMultiselectOpen.emit();
    const stopInterval = new Subject<void>();
    interval(50).pipe(takeUntil(stopInterval)).subscribe(() => {
      this.changeDetectorRef.detectChanges();
    });
    timer(200).subscribe(() => {
      stopInterval.next();
    });
  }

  onMenuClose(): void {
    this.isOpen.set(false);
    this.jvxMultiselectClose.emit();
  }

  deselect(val: any): void {
    this.value = [...this.value.filter(v => v[this.itemValue] !== val[this.itemValue])];
    // this.value.splice(this.value.findIndex(v => v[this.itemValue] === val[this.itemValue]), 1);
    this.form.get('selectionValue').setValue(this.value.map(m => m.value));
    this.valueChange.emit(this.value);
    this.propagateChange(this.value);
    this.changeDetectorRef.markForCheck();
  }

  private setSelectionContainerSize(): void {

  }

  clickOnMenuTrigger(e: MouseEvent): void {
    if (!this.disabled && !this.isLoading) {
      this.showList = false;
      this.shouldLoadMore = true;
      timer(0).subscribe(() => {
        this.showList = true;
        if (this.url.length > 0) {
          e.preventDefault();

          this.selectableOptions.length = 0;
          this.updateOrderedOptions(this.selectableOptions);
          this.getList().subscribe(noop);
          this.setSelectionContainerSize();

        } else {
          this.trigger.openMenu();
          this.setSelectionContainerSize();
        }
      });
    }
  }

  private getList(): Observable<any> {
    this.isLoading = true;
    return this.service.getList({
      url: this.url,
      requestType: this.requestType,
      data: this.postPayload() ?? {},
      currentPage: ++this.currentPage,
      ignorePagination: this.ignorePagination,
      requestHeaders: this.requestHeaders,
      search: this.searchValue,
      searchProp: this.searchProp,
      pageSize: this.intPageSize
    }).pipe(
      map((val) => {
        return val ?? [];
      }),
      switchMap((val) => this.multiMapper.mapOptions(val)), switchMap((val) => {
        let result = [];
        if (!val) {
          result = [];
        } else if (this.listProp.length > 0) {
          result = [...(val[this.listProp] ?? [])];
        } else {
          result = [...val];
        }

        if (result.length === 0) {
          this.shouldLoadMore = false;
          this.isLoading = false;
          return of([]);
        } else {
          const newOptions = [];

          for (const opt of result) {
            const newOption = this.mapper.mapOption(opt);
            newOptions.push(newOption);
          }
          return forkJoin(newOptions);
        }
      }), switchMap((finVal: any) => {
        this.selectableOptions.push(...finVal);
        return this.updateOrderedOptions(this.selectableOptions);
      }), map((val) => {
        this.isLoading = false;
        this.trigger.openMenu();
        this.setSelectionContainerSize();
        return val;
      }),
      tap(() => {
        this.changeDetectorRef.markForCheck();
      }),
      catchError((error) => {
        this.isLoading = false;
        this.changeDetectorRef.markForCheck();
        return throwError(() => error);
      })
    );
  }

  onScrolled(e: any): void {
    if (e.target.scrollTop + 220 + ((this.searchInput ? 0 : 1) * 40) - this.menuFooter().nativeElement.offsetHeight === this.selectionContainer().nativeElement.offsetHeight
      && !this.isLoading) {
      this.scrollEnd.emit();
      if (this.url && this.url.length > 0 && !this.ignorePagination && this.shouldLoadMore) {
        this.getList().subscribe(noop);
      }
    }
  }

  onMenuOpened(): void {
    this.jvxMultiselectOpened.emit();
  }

  onMenuClosed(): void {
    if ((!this.url || this.url.length === 0) && this.searchMode === 'client') {
      this.searchValueSubject.next('');
    } else {
      this.searchValue = '';
      this.currentPage = 0;
    }
    this.jvxMultiselectClosed.emit();
    this.changeDetectorRef.markForCheck();
  }

  onSearchInputClick(e: MouseEvent): void {
    e.stopPropagation();
  }

  onSearchValueChange(e: any): void {
    this.searchValueSubject.next(e.target.value);
  }

  clear(e: Event): void {
    e.stopPropagation();
    e.preventDefault();
    this.value = [];
    this.form.get('selectionValue').setValue(this.value.map(v => v[this.itemValue]));
    this.propagateChange(this.value);
    this.valueChange.emit(this.value);
    this.changeDetectorRef.markForCheck();
  }

  setDescribedByIds(ids: string[]): void {
    const controlElement = this.elementRef.nativeElement
      .querySelector('.ng-jvx-multiselect');
    controlElement.setAttribute('aria-describedby', ids.join(' '));
  }

  onContainerClick(event: MouseEvent): void {
    // if ((event.target as Element).tagName.toLowerCase() !== 'input') {
    //   this.elementRef.nativeElement.querySelector('input').focus();
    // }
  }

  private get stateChange$(): Observable<any> {
    return this.stateChanges.asObservable();
  }

  updateOrderedOptions(options): Observable<any> {
    let obs = of(options);
    if (this.groupBy) {
      this.orderedOptions.length = 0;
      const obsArr = [];
      for (const option of options) {
        if (typeof this.groupBy !== 'string') {
          obsArr.push(this.groupBy.mapGroup(option));
        } else {
          obsArr.push(of({group: option[this.groupBy], option} as NgJvxGroup<any>));
        }
      }
      obs = forkJoin(obsArr).pipe(map((res: any) => {
        const groups = [...new Set(res.map(item => item.group))];
        for (const group of groups) {
          this.orderedOptions.push({
            group,
            options: res.filter(r => r.group === group).map(o => o.option)
          });
        }
        return this.orderedOptions;
      }));
    }
    return obs;
  }

  public closeMenu(): void {
    this.trigger.closeMenu();
  }

  public isOptionSelected(option: any): boolean {
    return this.form.get('selectionValue').value.some(s => s === option[this.itemValue]);
  }

  clickOnOption(option: any): void {
    if (this.isOptionSelected(option)) {
      this.deselect(option);
    } else {
      this.select(option);
    }
  }

  select(option: any): void {
    if (!this.multi) {
      this.form.get('selectionValue').reset([]);
      this.value = [];
    }
    this.value.push(option);

    this.value.sort((a, b) => {
      return typeof a[this.itemValue] === 'string' ?
        a[this.itemValue].localeCompare(b[this.itemValue]) : a[this.itemValue] - b[this.itemValue];
    });
    const val = this.form.get('selectionValue').value.concat([option[this.itemValue]]);
    val.sort((a, b) => {
      return typeof a[this.itemValue] === 'string' ?
        a[this.itemValue].localeCompare(b[this.itemValue]) : a[this.itemValue] - b[this.itemValue];
    });
    this.form.get('selectionValue').setValue(val);
    this.propagateChange(this.value);
    this.valueChange.emit(this.value);
    this.changeDetectorRef.markForCheck();
  }
}
