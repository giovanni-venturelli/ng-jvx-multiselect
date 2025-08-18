import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import {Overlay} from '@angular/cdk/overlay';
import {fromEvent, noop, Subject, takeUntil, tap} from 'rxjs';
import {PanelComponent} from '../panel.component';

@Directive({
  selector: '[lib-menu-trigger-for], [libMenuTriggerFor]'
})
export class MenuTriggerDirective implements OnDestroy, AfterViewInit {
  private unsubscribe = new Subject<void>();

  @Output() closed = new EventEmitter<void>();
  @Output() onMenuOpen = new EventEmitter<void>();
  @Output() menuOpened = new EventEmitter<void>();
  @Output() onMenuClose = new EventEmitter<void>();
  @Output() menuClosed = new EventEmitter<void>();

  /** References the menu instance that the trigger is associated with. */
  get menu(): PanelComponent | null {
    return this._menu;
  }

  @Input()
  set libMenuTriggerFor(menu: PanelComponent | null) {
    this._menu = menu;
  }

  // tslint:disable-next-line:variable-name
  private _menu: PanelComponent | null = null;


  constructor(private el: ElementRef, private overlay: Overlay) {
    fromEvent(this.el.nativeElement, 'click')
      .pipe(
        takeUntil(this.unsubscribe),
        tap(() => {
          if (this.menu) {
            this.openMenu();
          }
        })
      )
      .subscribe(noop);
  }

  ngAfterViewInit(): void {
    if (this.menu) {
      this.menu.onOpened.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
        this.menuOpened.emit();
      });
      this.menu.onClose.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
        this.onMenuClose.emit();
      });
      this.menu.onClosed.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
        this.menuClosed.emit();
      });
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  closeMenu(): void {
    this.menu.close();
  }

  openMenu(): void {
    this.menu.trigger = this.el;
    this.menu.open();
    this.onMenuOpen.emit();
    this.menu.open();
  }
}
