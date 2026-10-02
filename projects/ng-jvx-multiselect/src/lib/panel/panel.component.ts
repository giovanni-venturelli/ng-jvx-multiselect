import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  input,
  NgZone,
  output,
  signal,
  ViewEncapsulation
} from '@angular/core';
import {CdkConnectedOverlay, ConnectedOverlayPositionChange, ConnectedPosition} from '@angular/cdk/overlay';

export type JvxPanelPosition = 'above' | 'below';

type PanelState = 'closed' | 'opening' | 'open' | 'closing';

/** Duration of the enter/leave animation; keep in sync with panel.component.scss. */
const ANIMATION_MS = 80;

const POSITIONS: ConnectedPosition[] = [
  {originX: 'start', originY: 'center', overlayX: 'start', overlayY: 'top'},
  {originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom'}
];

/**
 * Overlay panel of the multiselect. Internal: it only handles attaching/detaching the overlay with its
 * animation and reports when the user asks to close it (backdrop click, Escape, window resize).
 */
@Component({
  selector: 'lib-panel',
  imports: [CdkConnectedOverlay],
  templateUrl: './panel.component.html',
  styleUrl: './panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class PanelComponent {
  readonly origin = input.required<ElementRef<HTMLElement>>();
  readonly panelClass = input<string | string[]>('');
  readonly width = input<number>(0);

  /** The panel finished its opening animation. */
  readonly opened = output<void>();
  /** The panel finished its closing animation and has been detached. */
  readonly closed = output<void>();
  /** The user asked to close the panel. */
  readonly closeRequest = output<void>();

  protected readonly positions = POSITIONS;
  protected readonly panelClasses = computed(() => {
    const extra = this.panelClass();
    return ['ng-jvx-multiselect-panel', ...(Array.isArray(extra) ? extra : [extra])].filter(c => !!c);
  });
  protected readonly attached = signal(false);
  protected readonly state = signal<PanelState>('closed');
  protected readonly position = signal<JvxPanelPosition>('below');

  private readonly zone = inject(NgZone);
  private timer: ReturnType<typeof setTimeout> | undefined;
  private readonly onResize = () => this.zone.run(() => this.closeRequest.emit());

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      clearTimeout(this.timer);
      window.removeEventListener('resize', this.onResize);
    });
  }

  open(): void {
    if (this.state() === 'open' || this.state() === 'opening') {
      return;
    }
    this.attached.set(true);
    this.transition('opening', 'open', () => this.opened.emit());
    this.zone.runOutsideAngular(() => window.addEventListener('resize', this.onResize, {passive: true}));
  }

  close(): void {
    if (this.state() === 'closed' || this.state() === 'closing') {
      return;
    }
    window.removeEventListener('resize', this.onResize);
    this.transition('closing', 'closed', () => {
      this.attached.set(false);
      this.closed.emit();
    });
  }

  protected onPositionChange(change: ConnectedOverlayPositionChange): void {
    const position = change.connectionPair.overlayY === 'bottom' ? 'above' : 'below';
    if (position !== this.position()) {
      this.zone.run(() => this.position.set(position));
    }
  }

  /** The overlay was detached from outside (e.g. on navigation): report it as a close request. */
  protected onDetach(): void {
    if (this.state() === 'open' || this.state() === 'opening') {
      this.closeRequest.emit();
    }
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.closeRequest.emit();
    }
  }

  private transition(from: PanelState, to: PanelState, done: () => void): void {
    clearTimeout(this.timer);
    this.state.set(from);
    this.timer = setTimeout(() => {
      this.state.set(to);
      done();
    }, ANIMATION_MS);
  }
}
