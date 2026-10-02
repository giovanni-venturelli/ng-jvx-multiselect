import {TestBed} from '@angular/core/testing';
import {provideHttpClient} from '@angular/common/http';
import {AppComponent} from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideHttpClient()]
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
    const anchors = fixture.componentInstance.nav.reduce((count, g) => count + g.links.length, 0);
    expect(sections.length).toBe(anchors);
  });
});
