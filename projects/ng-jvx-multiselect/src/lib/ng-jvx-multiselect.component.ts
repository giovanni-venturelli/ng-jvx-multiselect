import {
  AfterViewChecked,
  Component,
  ContentChild,
  ElementRef, EventEmitter, forwardRef,
  Input,
  OnChanges,
  OnInit, Output, QueryList,
  SimpleChanges,
  TemplateRef,
  ViewChild, ViewChildren
} from '@angular/core';
import {NgJvxOptionsTemplateDirective} from './directives/ng-jvx-options-template.directive';
import {FormBuilder, FormControl, FormGroup, NG_VALUE_ACCESSOR} from '@angular/forms';
import {MatSelectionListChange} from '@angular/material/list';
import {NgJvxOptionComponent} from './ng-jvx-option/ng-jvx-option.component';

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
export class NgJvxMultiselectComponent implements OnInit, AfterViewChecked, OnChanges {
  @ViewChild('jvxMultiselect', {static: true}) jvxMultiselect: ElementRef;
  @ContentChild(NgJvxOptionsTemplateDirective) optionsTemplate: NgJvxOptionsTemplateDirective | null = null;
  // @ContentChild(NgJvxOptionComponent) optionComp: NgJvxOptionComponent;
  @ViewChildren(NgJvxOptionComponent) optionComp: QueryList<NgJvxOptionComponent>;
  // @ContentChild(TemplateRef) optionsTemplate: TemplateRef<any> | null = null;
  @Input() options: any[] = [];
  @Input() multi = false;
  @Input() itemValue = 'value';
  @Input() itemText = 'text';
  @Input() value: any[] = [];
  @Output() valueChange: EventEmitter<any[]> = new EventEmitter<any[]>();
  public form: FormGroup;
  public isOpen = false;

  constructor(private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      selectionValue: new FormControl(this.selectionValue)
    });
  }

  ngOnInit(): void {
    console.log(innerWidth);
    console.log(this.jvxMultiselect.nativeElement.offsetWidth);
  }

  ngAfterViewChecked(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.options) {
      console.log(changes.options.currentValue);
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
    this.value = [...this.options.filter(o => vals.includes(o[this.itemValue]))];
    this.valueChange.emit(this.value);
    this.propagateChange(this.value);
  }

  onMenuOpen(): void {
    this.isOpen = true;
  }

  onMenuClose(): void {
    this.isOpen = false;
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
}
