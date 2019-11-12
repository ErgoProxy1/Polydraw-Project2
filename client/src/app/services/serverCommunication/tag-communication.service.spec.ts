import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { getTestBed, TestBed } from '@angular/core/testing';
import { TagsInfo } from '../../../../../common/communication/tags';
import { SERVER_BASE_URL } from '../utils/constantsAndEnums';
import { TagCommunicationService } from './tag-communication.service';

describe('TagCommunicationService', () => {

  let tesBed: TestBed;
  let httpMock: HttpTestingController;
  let service: TagCommunicationService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpClientTestingModule],
      providers: [HttpClientModule],
    });

    tesBed = getTestBed();
    httpMock = tesBed.get(HttpTestingController);
    service = tesBed.get(TagCommunicationService);

  });
  afterEach(() => {
    httpMock.verify();
  });
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('Should return an Observable<TagsInfo[]> with the correct dummytags', () => {
    const dummyTags: TagsInfo[] = [{
      id: 0,
      tagName: 'house',
    },
    {
      id: 1,
      tagName: 'cloud',
    },
    {
      id: 2,
      tagName: 'window',
    },
    {
      id: 3,
      tagName: '',
    }];

    service.getAllTags().subscribe((tags) => {
      expect(tags.length).toBe(4);
      expect(tags).toEqual(dummyTags);
    });
    const req = httpMock.expectOne(`${SERVER_BASE_URL}/tags/`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyTags);

  });

  it('Should return an Observable<TagsInfo[]> with empty dummytags ', () => {
    const dummyTags: TagsInfo[] = [];

    service.getAllTags().subscribe((tags) => {
      expect(tags.length).toBe(0);
      expect(tags).toEqual(dummyTags);
    });
    const req = httpMock.expectOne(`${SERVER_BASE_URL}/tags/`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyTags);

  });

  it('should return an error', () => {
    // tslint:disable-next-line: no-empty
    service.getAllTags().subscribe(() => {
    }, (error) => {
      expect(error).toBeTruthy();
    });
    const req =  httpMock.expectOne(`${SERVER_BASE_URL}/tags/`);
    req.flush(3);

    // tslint:disable-next-line: no-empty
    service.getAllTags().subscribe(() => {
    }, (error) => {
      expect(error).toBeTruthy();
    });
    const req2 =  httpMock.expectOne(`${SERVER_BASE_URL}/tags/`);
    req2.flush('asda');
  });
});
