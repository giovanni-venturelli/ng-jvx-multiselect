import {
  AfterViewInit,
  Component,
  ContentChild,
  ElementRef, EventEmitter, forwardRef,
  Input,
  OnChanges, OnDestroy,
  OnInit, Output, QueryList,
  SimpleChanges,
  ViewChild, ViewChildren
} from '@angular/core';
import {NgJvxOptionsTemplateDirective} from './directives/ng-jvx-options-template.directive';
import {FormBuilder, FormControl, FormGroup, NG_VALUE_ACCESSOR} from '@angular/forms';
import {MatSelectionList, MatSelectionListChange} from '@angular/material/list';
import {NgJvxOptionComponent} from './ng-jvx-option/ng-jvx-option.component';
import {MatMenuTrigger} from '@angular/material/menu';
import {NgJvxMultiselectService} from './ng-jvx-multiselect.service';
import {HttpHeaders} from '@angular/common/http';
import {NgScrollbar} from 'ngx-scrollbar';
import {concatAll, map, switchMap, takeUntil} from 'rxjs/operators';
import {forkJoin, from, Observable, of, Subject} from 'rxjs';
import {NgJvxOptionMapper} from './interfaces/ng-jvx-option-mapper';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ng-jvx-multiselect',
  templateUrl: './ng-jvx-multiselect.component.html',
  styleUrls: ['./ng-jvx-multiselect.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NgJvxMultiselectComponent),
      multi: true,
    }]
})
export class NgJvxMultiselectComponent implements OnInit, OnDestroy, AfterViewInit, OnChanges {
  @ViewChild('jvxMultiselect', {static: true}) jvxMultiselect: ElementRef;
  @ViewChild('selectionContainer', {static: true}) selectionContainer: ElementRef;
  @ViewChild('selection', {static: true}) selection: MatSelectionList;
  @ViewChild('trigger', {static: true}) trigger: MatMenuTrigger;
  @ViewChild('scrollbar', {static: false}) scrollbar: NgScrollbar;

  @ContentChild(NgJvxOptionsTemplateDirective) optionsTemplate: NgJvxOptionsTemplateDirective | null = null;
  // @ContentChild(NgJvxOptionComponent) optionComp: NgJvxOptionComponent;
  @ViewChildren(NgJvxOptionComponent) optionComp: QueryList<NgJvxOptionComponent>;
  // @ContentChild(TemplateRef) optionsTemplate: TemplateRef<any> | null = null;
  @Input() options: any[] = [];
  @Input() multi = false;
  @Input() url = '';
  @Input() requestType: 'get' | 'post' = 'get';
  @Input() itemValue = 'value';
  @Input() itemText = 'text';
  private pValue: any[] = [];

  get value(): any[] {
    return this.pValue;
  }

  @Input() set value(value: any[]) {
    this.pValue = value;
    this.form.get('selectionValue').setValue(this.pValue.map(v => v[this.itemValue]));
  }

  @Input() ignorePagination = false;
  @Input() clearable = false;
  @Input() closeOnClick = true;
  @Input() disabled = false;
  @Input() hasErrors = false;
  @Input() searchInput = false;
  @Input() searchLabel = 'search';
  @Input() listProp = '';
  @Input() totalRowsProp = '';
  @Input() mapper: NgJvxOptionMapper<any> = {
    mapOption(source: any): Observable<any> {
      return of(source);
    }
  };
  @Input() requestHeaders: HttpHeaders = new HttpHeaders();
  @Output() valueChange: EventEmitter<any[]> = new EventEmitter<any[]>();
  @Output() open: EventEmitter<void> = new EventEmitter<void>();
  @Output() opened: EventEmitter<void> = new EventEmitter<void>();
  @Output() close: EventEmitter<void> = new EventEmitter<void>();
  @Output() closed: EventEmitter<void> = new EventEmitter<void>();
  @Output() scrollEnd: EventEmitter<void> = new EventEmitter<void>();

  public form: FormGroup;
  public isOpen = false;
  public isLoading = false;
  public showList = true;
  public asyncOptions: any = [];
  public selectableOptions = [];
  public searchValue = '';
  public currentPage = 0;
  private pageSize = 15;
  private unsubscribe = new Subject<void>();
  private unsubscribe$ = this.unsubscribe.asObservable();

  constructor(private formBuilder: FormBuilder, private service: NgJvxMultiselectService) {
    this.form = this.formBuilder.group({
      selectionValue: new FormControl(this.selectionValue)
    });
  }

  ngOnInit(): void {
    this.selectableOptions = [...this.options];
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
  }

  ngAfterViewInit(): void {
    if (this.scrollbar) {
      this.scrollbar.scrolled.pipe(takeUntil(this.unsubscribe$)).subscribe((e: any) => {
        this.onScrolled(e);
      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.options) {
      this.selectableOptions = [...this.options];
    }
  }


  get selectionValue(): any[] {
    return this.value.map((v) => {
      return v[this.itemValue];
    });
  }

  set selectionValue(val: any[]) {

  }

  onCLickOnMenu(e: MouseEvent): void {
    if (this.multi || this.closeOnClick === false) {
      e.stopPropagation();
    }

  }


  private propagateChange = (_: any) => {
  };

  // this is the initial value set to the component
  public writeValue(obj: any[]): void {
    this.value = obj;
  }

  // registers 'fn' that will be fired when changes are made
  // this is how we emit the changes back to the form
  public registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  // not used, used for touch input
  public registerOnTouched(): void {
  }

  onChange(e: MatSelectionListChange): void {
    const vals = e.source.selectedOptions.selected.map(o => o.value);
    this.value = [...this.selectableOptions.filter(o => vals.includes(o[this.itemValue]))];
    this.form.get('selectionValue').setValue(this.value.map(v => v[this.itemValue]));
    this.valueChange.emit(this.value);
    this.propagateChange(this.value);
  }

  onMenuOpen(): void {
    this.isOpen = true;
    this.showList = false;
    setTimeout(() => {
      this.showList = true;
    }, 0);
    this.open.emit();
  }

  onMenuClose(): void {
    this.isOpen = false;
    this.close.emit();
  }

  deselect(val: any): void {
    this.value.splice(this.value.findIndex(v => v[this.itemValue] === val[this.itemValue]), 1);

    this.optionComp.toArray().forEach((opt) => {
        if (opt.value === val[this.itemValue]) {
          opt.deselect();
        }
      }
    );
    this.valueChange.emit(this.value);
  }

  clickOnMenuTrigger(e: MouseEvent): void {
    if (!this.disabled) {
      if (this.url.length > 0) {
        e.preventDefault();
        this.selectableOptions.length = 0;
        this.getList();
      } else {
        this.trigger.openMenu();
      }
    }
  }

  private getList(): void {
    this.isLoading = true;
    this.service.getList({
      url: this.url,
      requestType: this.requestType,
      data: {},
      currentPage: ++this.currentPage,
      ignorePagination: this.ignorePagination,
      requestHeaders: this.requestHeaders,
      pageSize: this.pageSize
    }).subscribe((val) => {
      const newOptions = [];

      for (const opt of val) {
        const newOption = this.mapper.mapOption(opt);
        newOptions.push(newOption);
      }
      from(newOptions).pipe(concatAll())
        .subscribe((finVal: any) => {
          this.selectableOptions.push(finVal);
          this.isLoading = false;
          this.trigger.openMenu();
        });
    });
  }

  onScrolled(e: any): void {
    if (e.target.scrollTop + 220 + ((this.searchInput ? 0 : 1) * 40) === this.selectionContainer.nativeElement.offsetHeight && !this.isLoading) {
      this.scrollEnd.emit();
      this.getList();
    }
  }

  onMenuOpened(): void {
    this.opened.emit();
  }

  onMenuClosed(): void {
    this.currentPage = 0;
    this.searchValue = '';
    this.closed.emit();
  }

  onSearchInputClick(e: MouseEvent): void {
    e.stopPropagation();
  }

  onSearchValueChange(e: any): void {
    console.log(e.target?.value);
  }
}
