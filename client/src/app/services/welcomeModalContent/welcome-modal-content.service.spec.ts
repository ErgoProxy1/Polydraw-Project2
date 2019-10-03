import { TestBed } from '@angular/core/testing';

import { WelcomeModalContentService } from './welcome-modal-content.service';

describe('WelcomeModalContentService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WelcomeModalContentService = TestBed.get(WelcomeModalContentService);
    expect(service).toBeTruthy();
  });
});
