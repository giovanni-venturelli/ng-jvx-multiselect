import {ChangeDetectionStrategy, Component, input, output, TemplateRef, ViewEncapsulation} from '@angular/core';
import {NgTemplateOutlet} from '@angular/common';
import {NgJvxOptionComponent} from '../../option/ng-jvx-option.component';
import {NgJvxOptionGroup} from '../../core/models';
import {keyOf} from '../../core/selection';
import {NgJvxOptionsTemplateContext} from '../../directives/ng-jvx-options-template.directive';
import {NgJvxGroupHeaderContext} from '../../directives/ng-jvx-group-header.directive';

/** Renders the options of the panel, flat or grouped. Internal. */
@Component({
  selector: 'lib-option-list',
  imports: [NgTemplateOutlet, NgJvxOptionComponent],
  templateUrl: './option-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class OptionListComponent {
  readonly options = input<readonly any[]>([]);
  readonly groups = input<readonly NgJvxOptionGroup[]>([]);
  readonly grouped = input(false);
  readonly itemValue = input.required<string>();
  readonly itemText = input.required<string>();
  readonly selectedKeys = input.required<ReadonlySet<unknown>>();
  readonly optionTemplate = input<TemplateRef<NgJvxOptionsTemplateContext> | null | undefined>(null);
  readonly groupHeaderTemplate = input<TemplateRef<NgJvxGroupHeaderContext> | null | undefined>(null);

  readonly optionClick = output<any>();

  protected key(option: unknown): unknown {
    return keyOf(option, this.itemValue());
  }
}
