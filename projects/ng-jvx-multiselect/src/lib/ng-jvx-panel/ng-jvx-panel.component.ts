/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component, ContentChild, ContentChildren, Directive,
  ElementRef, EventEmitter,
  Inject, Input,
  NgZone, OnDestroy, OnInit, Output, QueryList, TemplateRef, ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  _MatMenuBase,
  MAT_MENU_CONTENT,
  MAT_MENU_DEFAULT_OPTIONS,
  MAT_MENU_PANEL,
  MatMenu,
  matMenuAnimations, MatMenuContent,
  MatMenuDefaultOptions, MatMenuItem, MatMenuPanel, MenuPositionX, MenuPositionY
} from '@angular/material/menu';
import {FocusKeyManager, FocusOrigin} from '@angular/cdk/a11y';
import {startWith, switchMap, take} from 'rxjs/operators';
import {merge, Observable, Subject, Subscription} from 'rxjs';
import {MenuCloseReason} from '@angular/material/menu/menu';
import {coerceBooleanProperty} from '@angular/cdk/coercion';
import {throwMatMenuInvalidPositionX, throwMatMenuInvalidPositionY} from '@angular/material/menu/menu-errors';
import {Direction} from '@angular/cdk/bidi';




/** @docs-public MatMenu */
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ngJvxPanel',
  templateUrl: 'ng-jvx-panel.component.html',
  styleUrls: ['ng-jvx-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  exportAs: 'ngJvxPanel',
  // tslint:disable-next-line:no-host-metadata-property
  host: {
    '[attr.aria-label]': 'null',
    '[attr.aria-labelledby]': 'null',
    '[attr.aria-describedby]': 'null',
  },
  animations: [
    matMenuAnimations.transformMenu,
    matMenuAnimations.fadeInItems
  ],
  providers: [
    {provide: MAT_MENU_PANEL, useExisting: MatMenu},
  ]
})
export class NgJvxPanelComponent extends _MatMenuBase {
  constructor(elementRef: ElementRef<HTMLElement>, ngZone: NgZone,
              @Inject(MAT_MENU_DEFAULT_OPTIONS) defaultOptions: MatMenuDefaultOptions) {
    super(elementRef, ngZone, defaultOptions);
  }
}

