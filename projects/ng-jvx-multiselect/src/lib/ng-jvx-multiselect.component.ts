import {
  AfterContentChecked, AfterViewChecked,
  AfterViewInit,
  Component,
  ContentChild,
  ElementRef, EventEmitter, forwardRef,
  Input,
  OnChanges, OnDestroy,
  OnInit, Output, QueryList,
  SimpleChanges, TemplateRef,
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
import {concatAll, debounce, debounceTime, map, switchMap, take, takeUntil} from 'rxjs/operators';
import {forkJoin, from, Observable, of, Subject, timer} from 'rxjs';
import {NgJvxOptionMapper} from './interfaces/ng-jvx-option-mapper';
import {NgJvxSelectionTemplateDirective} from './directives/ng-jvx-selection-template.directive';

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
  @ViewChild('selectionContainer', {static: false}) selectionContainer: ElementRef;
  @ViewChild('selection', {static: true}) selection: MatSelectionList;
  @ViewChild('trigger', {static: true}) trigger: MatMenuTrigger;
  @ViewChild('scrollbar', {static: false}) scrollbar: NgScrollbar;

  @ContentChild(NgJvxOptionsTemplateDirective) optionsTemplate: NgJvxOptionsTemplateDirective | null = null;
  @ContentChild(NgJvxSelectionTemplateDirective) selectionTemplate: NgJvxSelectionTemplateDirective | null = null;
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
  @Input() panelClass = '';
  @Input() mapper: NgJvxOptionMapper<any> = {
    mapOption(source: any): Observable<any> {
      return of(source);
    }
  };
  @Input() requestHeaders: HttpHeaders = new HttpHeaders();
  @Output() valueChange: EventEmitter<any[]> = new EventEmitter<any[]>();
  @Output() jvxMultiselectOpen: EventEmitter<void> = new EventEmitter<void>();
  @Output() jvxMultiselectOpened: EventEmitter<void> = new EventEmitter<void>();
  @Output() jvxMultiselectClose: EventEmitter<void> = new EventEmitter<void>();
  @Output() jvxMultiselectClosed: EventEmitter<void> = new EventEmitter<void>();
  @Output() scrollEnd: EventEmitter<void> = new EventEmitter<void>();

  public document = document;
  public window = window;
  public form: FormGroup;
  public isOpen = false;
  public isLoading = false;
  public showList = true;
  public asyncOptions: any = [];
  public selectableOptions = [];
  public searchValue = '';
  public currentPage = 0;
  public listContainerSize: { height: string, minHeight: string, width: string } = {height: 'auto', minHeight: '0', width: '100%'};
  private pageSize = 15;
  private unsubscribe = new Subject<void>();
  private unsubscribe$ = this.unsubscribe.asObservable();
  private resizeSubject = new Subject<void>();
  private resize$ = this.resizeSubject.asObservable();

  constructor(private formBuilder: FormBuilder, private service: NgJvxMultiselectService) {
    this.form = this.formBuilder.group({
      selectionValue: new FormControl(this.selectionValue)
    });
  }

  ngOnInit(): void {
    this.selectableOptions = [...this.options];
    window.addEventListener('resize', () => {
      timer(0).subscribe(() => {
        this.resizeSubject.next();
      });
    });
    this.resize$.pipe(takeUntil(this.unsubscribe), debounceTime(100)).subscribe(() => {
      this.listContainerSize.width = this.jvxMultiselect.nativeElement.offsetWidth + 'px';
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
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

    this.jvxMultiselectOpen.emit();
  }

  onMenuClose(): void {
    this.isOpen = false;
    this.jvxMultiselectClose.emit();
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
      timer(0).subscribe(() => {
        this.showList = true;
        if (this.url.length > 0) {
          e.preventDefault();
          this.selectableOptions.length = 0;
          this.getList();
        } else {
          this.trigger.openMenu();
          this.setSelectionContainerSize();
        }
      });
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
      let result = [];
      if (this.listProp.length > 0) {
        result = [...val[this.listProp]];
      } else {
        result = [...val];
      }
      const newOptions = [];

      for (const opt of result) {
        const newOption = this.mapper.mapOption(opt);
        newOptions.push(newOption);
      }
      from(newOptions).pipe(concatAll())
        .subscribe((finVal: any) => {
          this.selectableOptions.push(finVal);
          this.isLoading = false;
          this.trigger.openMenu();
          this.setSelectionContainerSize();
        });
    });
  }

  onScrolled(e: any): void {
    if (e.target.scrollTop + 220 + ((this.searchInput ? 0 : 1) * 40) === this.selectionContainer.nativeElement.offsetHeight
      && !this.isLoading) {
      this.scrollEnd.emit();
      if (this.url && this.url.length > 0 && !this.ignorePagination) {
        this.getList();
      }
    }
  }

  onMenuOpened(): void {
    this.jvxMultiselectOpened.emit();
  }

  onMenuClosed(): void {
    this.currentPage = 0;
    this.searchValue = '';
    this.jvxMultiselectClosed.emit();
  }

  onSearchInputClick(e: MouseEvent): void {
    e.stopPropagation();
  }

  onSearchValueChange(e: any): void {
  }

  clear(e: Event): void {
    e.stopPropagation();
    e.preventDefault();
    this.value = [];
    this.valueChange.emit(this.value);
  }

}
