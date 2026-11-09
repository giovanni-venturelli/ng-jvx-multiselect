import {Component, ElementRef, viewChild} from '@angular/core';
import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {PanelComponent} from './panel.component';

/** Panel animation (80ms) plus some margin. */
const ANIMATION = 100;

@Component({
  imports: [PanelComponent],
  template: `
    <div #origin>origin</div>
    <lib-panel [origin]="originRef()" (opened)="events.push('opened')" (closed)="events.push('closed')">
      <span class="content">content</span>
    </lib-panel>`
})
class HostComponent {
  readonly originRef = viewChild.required<ElementRef<HTMLElement>>('origin');
  readonly panel = viewChild.required(PanelComponent);
  events: string[] = [];
}

describe('PanelComponent', () => {
  let fixture: ComponentFixture<HostComponent>;

  const content = () => document.querySelector('.ng-jvx-panel .content');

  beforeEach(() => {
    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    document.querySelectorAll('.cdk-overlay-container').forEach(c => c.innerHTML = '');
  });

  it('should create', () => {
    expect(fixture.componentInstance.panel()).toBeTruthy();
    expect(content()).toBeNull();
  });

  it('shows the content and emits opened when open() is called, then closed after close()', fakeAsync(() => {
    const panel = fixture.componentInstance.panel();

    panel.open();
    fixture.detectChanges();
    tick(ANIMATION);
    fixture.detectChanges();

    expect(content()).not.toBeNull();
    expect(fixture.componentInstance.events).toEqual(['opened']);

    panel.close();
    fixture.detectChanges();
    tick(ANIMATION);
    fixture.detectChanges();

    expect(content()).toBeNull();
    expect(fixture.componentInstance.events).toEqual(['opened', 'closed']);
  }));
});
