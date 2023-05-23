/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {ChangeDetectionStrategy, Component, ElementRef, Inject, NgZone, ViewEncapsulation,} from '@angular/core';
import {
  MAT_LEGACY_MENU_DEFAULT_OPTIONS as MAT_MENU_DEFAULT_OPTIONS,
  MAT_LEGACY_MENU_PANEL as MAT_MENU_PANEL,
  matLegacyMenuAnimations as matMenuAnimations,
  MatLegacyMenuDefaultOptions as MatMenuDefaultOptions
} from '@angular/material/legacy-menu';
import {_MatMenuBase, MatMenu} from '@angular/material/menu';


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

