import { TestBed } from '@angular/core/testing';

import { HttpClientModule } from '@angular/common/http';
import { TagCommunicationService } from './tag-communication.service';

describe('TagCommunicationService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientModule],
    providers: [HttpClientModule],
  }));

  it('should be created', () => {
    const service: TagCommunicationService = TestBed.get(TagCommunicationService);
    expect(service).toBeTruthy();
  });
});
