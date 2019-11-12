import { TestBed } from '@angular/core/testing';

import { BoundingBoxService } from './bounding-box.service';

describe('BoundingBoxServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BoundingBoxService = TestBed.get(BoundingBoxService);
    expect(service).toBeTruthy();
  });
});
