import { TestBed } from '@angular/core/testing';

import { HttpClientModule } from '@angular/common/http';
import { DrawingCommunicationService } from './drawing-communication.service';

describe('DrawingCommunicationService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientModule],
    providers: [HttpClientModule],
  }));

  it('should be created', () => {
    const service: DrawingCommunicationService = TestBed.get(DrawingCommunicationService);
    expect(service).toBeTruthy();
  });
});
