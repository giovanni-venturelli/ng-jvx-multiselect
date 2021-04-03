import { TestBed } from '@angular/core/testing';

import { NgJvxMultiselectService } from './ng-jvx-multiselect.service';

describe('NgJvxMultiselectService', () => {
  let service: NgJvxMultiselectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgJvxMultiselectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
