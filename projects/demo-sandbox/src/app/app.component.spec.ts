import {TestBed} from '@angular/core/testing';
import {provideHttpClient} from '@angular/common/http';
import {provideNoopAnimations} from '@angular/platform-browser/animations';
import {AppComponent} from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideHttpClient(), provideNoopAnimations()]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render every example section', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const sections = fixture.nativeElement.querySelectorAll('section.demo-section');
    const anchors = fixture.componentInstance.nav.flatMap(g => g.links).length;
    expect(sections.length).toBe(anchors);
  });
});
