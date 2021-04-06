import {
  AfterViewChecked, AfterViewInit,
  Component,
  ContentChild,
  ElementRef, EventEmitter, forwardRef, HostListener,
  Input,
  OnChanges, OnDestroy,
  OnInit, Output, QueryList,
  SimpleChanges,
  TemplateRef,
  ViewChild, ViewChildren
} from '@angular/core';
import {NgJvxOptionsTemplateDirective} from './directives/ng-jvx-options-template.directive';
import {FormBuilder, FormControl, FormGroup, NG_VALUE_ACCESSOR} from '@angular/forms';
import {MatSelectionListChange} from '@angular/material/list';
import {NgJvxOptionComponent} from './ng-jvx-option/ng-jvx-option.component';
import {MatMenuTrigger} from '@angular/material/menu';
import {NgJvxMultiselectService} from './ng-jvx-multiselect.service';
import {HttpHeaders} from '@angular/common/http';
import {NgScrollbar} from 'ngx-scrollbar';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';

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
  @Input() value: any[] = [];
  @Input() ignorePagination = false;
  @Input() requestHeaders: HttpHeaders = new HttpHeaders();
  @Output() valueChange: EventEmitter<any[]> = new EventEmitter<any[]>();
  public form: FormGroup;
  public isOpen = false;
  public isLoading = false;
  public asyncOptions: any = [];
  public selectableOptions = [];
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
    console.log(innerWidth);
    console.log(this.jvxMultiselect.nativeElement.offsetWidth);
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
    if (this.multi) {
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
    this.valueChange.emit(this.value);
    this.propagateChange(this.value);
  }

  onMenuOpen(): void {
    this.isOpen = true;
  }

  onMenuClose(): void {
    this.isOpen = false;
    this.currentPage = 0;
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
    if (this.url.length > 0) {
      e.preventDefault();
      this.selectableOptions.length = 0;
      this.getList();
    } else {
      this.trigger.openMenu();
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
      this.selectableOptions.push(...val);
      this.isLoading = false;
      this.trigger.openMenu();
    });
  }

  @HostListener('scroll', ['$event'])
  onScroll(e: Event): void {
    console.log('scrolling');
    console.log(e);
  }

  onScrolled(e: any): void {
    console.log(e);
    if (e.target.scrollTop + 300 === this.selectionContainer.nativeElement.offsetHeight) {
      console.log('bottom');
      this.getList();

    }
  }
}
