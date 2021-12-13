import {
  AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  ContentChild,
  ElementRef, EventEmitter, forwardRef, HostBinding,
  Input,
  OnChanges, OnDestroy,
  OnInit, Optional, Output, QueryList, Self,
  SimpleChanges,
  ViewChild, ViewChildren
} from '@angular/core';
import {NgJvxOptionsTemplateDirective} from './directives/ng-jvx-options-template.directive';
import {ControlValueAccessor, FormBuilder, FormControl, FormGroup, NG_VALUE_ACCESSOR, NgControl} from '@angular/forms';
import {MatSelectionList, MatSelectionListChange} from '@angular/material/list';
import {NgJvxOptionComponent} from './ng-jvx-option/ng-jvx-option.component';
import {MatMenuTrigger} from '@angular/material/menu';
import {NgJvxMultiselectService} from './ng-jvx-multiselect.service';
import {HttpHeaders} from '@angular/common/http';
import {NgScrollbar} from 'ngx-scrollbar';
import {concatAll, concatMap, debounce, debounceTime, map, switchMap, take, takeUntil, tap} from 'rxjs/operators';
import {combineLatest, forkJoin, from, fromEvent, iif, noop, observable, Observable, of, Subject, timer} from 'rxjs';
import {NgJvxOptionMapper} from './interfaces/ng-jvx-option-mapper';
import {NgJvxSelectionTemplateDirective} from './directives/ng-jvx-selection-template.directive';
import {MatFormFieldControl} from '@angular/material/form-field';
import {coerceBooleanProperty} from '@angular/cdk/coercion';
import {NgJvxGroupHeaderDirective} from './directives/ng-jvx-group-header.directive';
import {NgJvxSearchMapper} from './interfaces/ng-jvx-search-mapper';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ng-jvx-multiselect',
  templateUrl: './ng-jvx-multiselect.component.html',
  styleUrls: ['./ng-jvx-multiselect.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: MatFormFieldControl,
      useExisting: forwardRef(() => NgJvxMultiselectComponent),
      multi: true,
    }]
})
export class NgJvxMultiselectComponent implements OnInit, OnDestroy, AfterViewInit, OnChanges, MatFormFieldControl<any>, ControlValueAccessor {
  static nextId = 0;
  @HostBinding() id = `jvx-multiselect-${NgJvxMultiselectComponent.nextId++}`;

  @HostBinding('class.floating')
  get shouldLabelFloat(): boolean {
    return this.focused || !this.empty;
  }

  @ViewChild('jvxMultiselect', {static: true}) jvxMultiselect: ElementRef;
  @ViewChild('selectionContainer', {static: false}) selectionContainer: ElementRef;
  @ViewChild('selection', {static: true}) selection: MatSelectionList;
  @ViewChild('trigger', {static: true}) trigger: MatMenuTrigger;
  @ViewChild('scrollbar', {static: false}) scrollbar: NgScrollbar;
  @ViewChild('multiContainer', {static: false}) multiContainer: ElementRef;
  @ViewChildren(NgJvxOptionComponent) optionComp: QueryList<NgJvxOptionComponent>;
  @ContentChild(NgJvxOptionsTemplateDirective) optionsTemplate: NgJvxOptionsTemplateDirective | null = null;
  @ContentChild(NgJvxSelectionTemplateDirective) selectionTemplate: NgJvxSelectionTemplateDirective | null = null;
  @ContentChild(NgJvxGroupHeaderDirective) groupHeaderTemplate: NgJvxGroupHeaderDirective | null = null;
  // @ContentChild(NgJvxOptionComponent) optionComp: NgJvxOptionComponent;
  // @ContentChild(TemplateRef) optionsTemplate: TemplateRef<any> | null = null;
  @Input() options: any[] = [];
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
  @Input() groupBy: string;
  @Input() mapper: NgJvxOptionMapper<any> = {
    mapOption(source: any): Observable<any> {
      return of(source);
    }
  };
  @Input() searchMapper: NgJvxSearchMapper<any> = {
    mapSearch: (source: string, options: any[]): Observable<any> => {
      return of(options.filter(o => o[this.itemText].includes(source)));
    }
  };

  @Input() set value(value: any[]) {
    this.pValue = value ?? [];
    if (value) {
      this.form.get('selectionValue').setValue(this.pValue.map(v => v[this.itemValue]));
    } else {
      this.form.get('selectionValue').setValue(value);
    }
    this.stateChanges.next();
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

  // tslint:disable-next-line:variable-name
  private _required = false;

  @Input()
  get disabled(): boolean {
    return this._disabled;
  }

  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
    this._disabled ? this.parts.disable() : this.parts.enable();
    this.stateChanges.next();
  }

  // tslint:disable-next-line:variable-name
  private _disabled = false;

  get errorState(): boolean {
    return this.ngControl.invalid && this.ngControl.touched;
  }

  @Output() valueChange: EventEmitter<any[]> = new EventEmitter<any[]>();
  @Output() jvxMultiselectOpen: EventEmitter<void> = new EventEmitter<void>();
  @Output() jvxMultiselectOpened: EventEmitter<void> = new EventEmitter<void>();
  @Output() jvxMultiselectClose: EventEmitter<void> = new EventEmitter<void>();
  @Output() jvxMultiselectClosed: EventEmitter<void> = new EventEmitter<void>();
  @Output() scrollEnd: EventEmitter<void> = new EventEmitter<void>();

  public controlType = 'ng-jvx-multiselect';
  public document = document;
  public window = window;
  public form: FormGroup;
  public isOpen = false;
  public isLoading = false;
  public showList = true;
  public asyncOptions: any = [];
  public selectableOptions = [];
  public orderedOptions: { group: any, options: any[] }[] = [];
  public searchValue = '';
  public yPosition: 'above' | 'below' = 'above';
  public stateChanges = new Subject<void>();
  public currentPage = 0;
  public listContainerSize: { height: string, minHeight: string, width: string } = {height: 'auto', minHeight: '0', width: '100%'};
  public parts: FormGroup;

  public touched = false;

  public placeholder: string;
  public focused = false;
  public multiContainerWidth = 100;

  private searchValueSubject = new Subject<string>();
  private searchValue$ = this.searchValueSubject.asObservable();
  private pValue: any[] = [];
  private shouldLoadMore = true;
  private pageSize = 15;
  private unsubscribe = new Subject<void>();
  private unsubscribe$ = this.unsubscribe.asObservable();
  public onTouched = () => {
  };


  constructor(private formBuilder: FormBuilder, private service: NgJvxMultiselectService,
              private elementRef: ElementRef,
              private changeDetectorRef: ChangeDetectorRef,
              @Optional() @Self() public ngControl: NgControl, fb: FormBuilder) {
    if (this.ngControl != null) {
      // Setting the value accessor directly (instead of using
      // the providers) to avoid running into a circular import.
      this.ngControl.valueAccessor = this;
    }

    this.parts = fb.group({
      area: '',
      exchange: '',
      subscriber: '',
    });
    this.form = this.formBuilder.group({
      selectionValue: new FormControl(this.selectionValue)
    });
  }

  ngOnInit(): void {
    this.stateChange$.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
      this.changeDetectorRef.markForCheck();
    });
    this.selectableOptions = [...this.options];
    this.updateOrderedOptions(this.selectableOptions);
    fromEvent(window, 'resize').pipe(takeUntil(this.unsubscribe), debounceTime(100), map(() => {
      return this.listContainerSize.width = this.jvxMultiselect.nativeElement.offsetWidth + 'px';

    }), switchMap(() => timer(100)), tap(() => {
      this.multiContainerWidth = this.multiContainer?.nativeElement?.offsetWidth ?? 100;
      this.yPosition = window.innerHeight - this.jvxMultiselect.nativeElement?.getBoundingClientRect()?.top < 260 ? 'above' : 'below';
      this.changeDetectorRef.markForCheck();
    })).subscribe(noop);

    this.searchValue$.pipe(takeUntil(this.unsubscribe), debounceTime(300), switchMap((val: string) => {

        const obsArray = [];
        if (val !== this.searchValue) {
          obsArray.push(of(true));
          if (this.searchMode === 'client' && this.url && this.url.length > 0) {
            this.selectableOptions = [];
            this.updateOrderedOptions(this.selectableOptions);
            this.shouldLoadMore = true;
            this.currentPage = 0;
            obsArray.push(this.getList().pipe(tap(() => {
              this.searchValue = val;
            })));
          } else if (!this.url || this.url.length === 0) {
            obsArray.push(of(this.options));
            this.searchValue = val;
          } else {
            this.shouldLoadMore = true;
            this.currentPage = 0;
            this.searchValue = val;
          }
        } else {
          obsArray.push(of(false));
        }
        return combineLatest(obsArray);
      }),
      switchMap(val => {
          if (val[0] && this.searchMode === 'client') {
            return this.searchMapper.mapSearch(this.searchValue, val[1]).pipe(tap((res) => {
              this.selectableOptions = [];
              this.selectableOptions.push(...res);
              this.updateOrderedOptions(this.selectableOptions);
            }));
          } else if (val[0]) {
            this.selectableOptions = [];
            this.updateOrderedOptions(this.selectableOptions);
            this.shouldLoadMore = true;
            return this.getList();
          } else {
            return of(null);
          }
        }
      )
    ).subscribe((val: any[]) => {
      this.changeDetectorRef.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.stateChanges.complete();
  }

  ngAfterViewInit(): void {
    timer(0).subscribe(() => {
      this.listContainerSize.width = this.jvxMultiselect.nativeElement.offsetWidth + 'px';
    });

    if (this.scrollbar) {
      this.scrollbar.scrolled.pipe(takeUntil(this.unsubscribe$)).subscribe((e: any) => {
        this.onScrolled(e);
      });
    }
    timer(0).pipe(tap(() => {
      this.multiContainerWidth = this.multiContainer?.nativeElement?.offsetWidth ?? 100;
      this.yPosition = window.innerHeight - this.jvxMultiselect.nativeElement?.getBoundingClientRect()?.top < 260 ? 'above' : 'below';
      this.changeDetectorRef.markForCheck();
    })).subscribe(noop);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.options) {
      this.selectableOptions = [...this.options];
      this.updateOrderedOptions(this.selectableOptions);
    }
  }


  get selectionValue(): any[] {
    return this.value.map((v) => {
      return v[this.itemValue];
    });
  }

  get empty(): boolean {
    const n = this.parts.value;
    return !n.area && !n.exchange && !n.subscriber;
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

  onChange(e: MatSelectionListChange): void {
    const vals = e.source.selectedOptions.selected.map(o => o.value);
    this.value = [...this.selectableOptions.filter(o => vals.includes(o[this.itemValue]))];
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
    this.isOpen = true;

    this.jvxMultiselectOpen.emit();
  }

  onMenuClose(): void {
    this.isOpen = false;
    this.jvxMultiselectClose.emit();
  }

  deselect(val: any): void {
    this.value = [...this.value];
    this.value.splice(this.value.findIndex(v => v[this.itemValue] === val[this.itemValue]), 1);
    this.form.get('selectionValue').setValue(this.value.map(m => m.value));
    this.valueChange.emit(this.value);
  }

  private setSelectionContainerSize(): void {
    timer(0).subscribe(() => {
      if (this.selectionContainer) {
        this.listContainerSize.height = this.selectionContainer.nativeElement.offsetHeight > 260 ? '260px' : 'auto';
        this.listContainerSize.minHeight = this.selectionContainer.nativeElement.offsetHeight <= 260 ?
          this.selectionContainer.nativeElement.offsetHeight + 'px' : '260px';
      }
    });
  }

  clickOnMenuTrigger(e: MouseEvent): void {
    if (!this.disabled) {
      this.showList = false;
      this.shouldLoadMore = true;
      timer(0).subscribe(() => {
        this.showList = true;
        if (this.url.length > 0) {
          e.preventDefault();

          this.selectableOptions.length = 0;
          this.updateOrderedOptions(this.selectableOptions);
          this.getList().subscribe(noop);

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
      data: {},
      currentPage: ++this.currentPage,
      ignorePagination: this.ignorePagination,
      requestHeaders: this.requestHeaders,
      search: this.searchValue,
      searchProp: this.searchProp,
      pageSize: this.pageSize
    }).pipe(switchMap((val) => {
      let result = [];
      if (this.listProp.length > 0) {
        result = [...val[this.listProp]];
      } else {
        result = [...val];
      }

      if (result.length === 0) {
        this.shouldLoadMore = false;
        this.isLoading = false;
        return forkJoin([]);
      } else {
        const newOptions = [];

        for (const opt of result) {
          const newOption = this.mapper.mapOption(opt);
          newOptions.push(newOption);
        }
        return forkJoin(newOptions);
      }
    }), tap((finVal: any) => {
      this.selectableOptions.push(...finVal);
      this.updateOrderedOptions(this.selectableOptions);
      this.isLoading = false;
      this.trigger.openMenu();
      this.setSelectionContainerSize();
      this.changeDetectorRef.markForCheck();
    }));
  }

  onScrolled(e: any): void {
    if (e.target.scrollTop + 220 + ((this.searchInput ? 0 : 1) * 40) === this.selectionContainer.nativeElement.offsetHeight
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
    if (!this.url || this.url.length === 0) {
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

  updateOrderedOptions(options): void {
    if (this.groupBy && this.groupBy.length > 0) {
      this.orderedOptions.length = 0;
      const groups = [...new Set(options.map(item => item[this.groupBy]))];
      for (const group of groups) {
        this.orderedOptions.push({
          group,
          options: options.filter(option => JSON.stringify(option[this.groupBy]) === JSON.stringify(group))
        });
      }
    }
  }
}
