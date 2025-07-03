import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  input,
  Input,
  InputSignal,
  OnDestroy,
  Output,
  signal,
  TemplateRef,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {CdkConnectedOverlay} from '@angular/cdk/overlay';
import {fromEvent, Subject, timer} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {animate, query, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'lib-panel',
  imports: [
    CdkConnectedOverlay
  ],
  templateUrl: './panel.component.html',
  styleUrl: './panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('animation', [
      transition(':enter', [
        query('.ng-jvx-panel.below-panel', [
          style({
            opacity: 0,
            transform: 'scaleY(0.8)',
            transformOrigin: 'top',
          }),
          animate('0.08s ease-in-out', style({
            opacity: 1,
            transform: 'scaleY(1)',
            transformOrigin: 'top',
          }))], {optional: true}),
        query('.ng-jvx-panel.above-panel', [
          style({
            opacity: 0,
            transform: 'scaleY(0.8)',
            transformOrigin: 'bottom',
          }),
          animate('0.08s ease-in-out', style({
            opacity: 1,
            transform: 'scaleY(1)',
            transformOrigin: 'bottom',
          }))], {optional: true})
      ]),
      transition(':leave', [
        query('.ng-jvx-panel.below-panel', [
          style({
            opacity: 1,
            transform: 'scaleY(1)',
            transformOrigin: 'top'
          }),
          animate('.08s ease-in-out', style({
            opacity: 0,
            transform: 'scaleY(0.8)',
            transformOrigin: 'top'
          })),
        ], {optional: true}),
        query('.ng-jvx-panel.above-panel', [
          style({
            opacity: 1,
            transform: 'scaleY(1)',
            transformOrigin: 'bottom'
          }),
          animate('.08s ease-in-out', style({
            opacity: 0,
            transform: 'scaleY(0.8)',
            transformOrigin: 'bottom'
          })),
        ], {optional: true})])
    ]),
  ]
})
export class PanelComponent implements OnDestroy {
  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  // -----------------------------------------------------------------------------------------------------
  // @ Refs
  // -----------------------------------------------------------------------------------------------------
  @ViewChild('menuTemplate', {static: true})
  menuTemplate!: TemplateRef<any>;

  protected isOpen = signal(false);
  private unsubscribe = new Subject<void>();

  // -----------------------------------------------------------------------------------------------------
  // @ Inputs
  // -----------------------------------------------------------------------------------------------------
  @Input() trigger!: ElementRef<any>;
  yPosition: InputSignal<'above' | 'below'> = input('above');
  multi = input.required<boolean>();
  // -----------------------------------------------------------------------------------------------------
  // @ Outputs
  // -----------------------------------------------------------------------------------------------------
  @Output() onClose = new EventEmitter<void>();
  @Output() onClosed = new EventEmitter<void>();
  @Output() onOpened = new EventEmitter<void>();
  // -----------------------------------------------------------------------------------------------------
  // @ lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  constructor() {
    fromEvent(window, 'resize')
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(() => {
        this.close();
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public Methods
  // -----------------------------------------------------------------------------------------------------

  open(): void {
    this.isOpen.set(true);
    timer(800).subscribe(() => {
      this.onOpened.emit();
    });
  }

  close(): void {
    this.isOpen.set(false);
    this.onClose.emit();
    timer(200).subscribe(() => {
      this.onClosed.emit();
    });
  }

  // -----------------------------------------------------------------------------------------------------
  // @ protected Methods
  // -----------------------------------------------------------------------------------------------------
  protected clickOnMenu(): void {
    if (!this.multi()) {
      this.close();
    }
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Private Methods
  // -----------------------------------------------------------------------------------------------------
}
