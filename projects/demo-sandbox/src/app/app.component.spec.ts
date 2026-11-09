import {ComponentFixture, TestBed} from '@angular/core/testing';
import {provideHttpClient} from '@angular/common/http';
import {AppComponent} from './app.component';
import {SEARCH_HIGHLIGHT_NAME} from './shared/search-highlight';

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

  describe('search', () => {
    const navLinks = (element: HTMLElement): string[] =>
      Array.from(element.querySelectorAll<HTMLAnchorElement>('.sidebar li a')).map(a => a.getAttribute('href') ?? '');

    const typeInSearch = (fixture: ComponentFixture<AppComponent>, text: string): void => {
      const input: HTMLInputElement = fixture.nativeElement.querySelector('.sidebar .search input');
      input.value = text;
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();
    };

    let fixture: ComponentFixture<AppComponent>;

    beforeEach(() => {
      fixture = TestBed.createComponent(AppComponent);
      fixture.detectChanges();
    });

    afterEach(() => CSS.highlights.delete(SEARCH_HIGHLIGHT_NAME));

    it('should list every example when the search is empty', () => {
      const total = fixture.componentInstance.nav.reduce((count, g) => count + g.links.length, 0);

      expect(navLinks(fixture.nativeElement).length).toBe(total);
    });

    it('should filter the links of the sidebar while typing', () => {
      typeInSearch(fixture, 'forms');

      expect(navLinks(fixture.nativeElement)).toEqual(['#forms']);
    });

    it('should find the examples that use the chip', () => {
      typeInSearch(fixture, 'chip');

      expect(navLinks(fixture.nativeElement)).toEqual(['#multi', '#templates']);
    });

    it('should hide the groups without results', () => {
      typeInSearch(fixture, 'forms');

      expect(fixture.nativeElement.querySelectorAll('.sidebar .nav-group').length).toBe(1);
    });

    it('should tell when nothing matches', () => {
      typeInSearch(fixture, 'zzzzz');

      expect(navLinks(fixture.nativeElement)).toEqual([]);
      expect(fixture.nativeElement.querySelector('.sidebar .no-results')).not.toBeNull();
    });

    it('should clear the search with the clear button', () => {
      typeInSearch(fixture, 'zzzzz');
      fixture.nativeElement.querySelector('.sidebar .search .clear').click();
      fixture.detectChanges();

      expect(fixture.componentInstance.query()).toBe('');
      expect(fixture.nativeElement.querySelector('.sidebar .search .clear')).toBeNull();
      expect(navLinks(fixture.nativeElement).length).toBeGreaterThan(1);
    });

    it('should highlight the words found in the main content', async () => {
      typeInSearch(fixture, 'multiselect');
      await fixture.whenStable();

      expect(CSS.highlights.get(SEARCH_HIGHLIGHT_NAME)?.size).toBeGreaterThan(0);
    });
  });
});
