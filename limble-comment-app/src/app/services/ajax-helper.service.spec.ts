import { TestBed } from '@angular/core/testing';

import { AjaxHelperService } from './ajax-helper.service';

describe('AjaxHelperService', () => {
  let service: AjaxHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AjaxHelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
