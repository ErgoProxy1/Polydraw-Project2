import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { getTestBed, TestBed } from '@angular/core/testing';
import { DrawingInfo } from '../../../../../common/communication/drawingInfo';
import { SERVER_BASE_URL } from '../utils/constantsAndEnums';
import { DrawingCommunicationService } from './drawing-communication.service';

describe('DrawingCommunicationService', () => {
  let tesBed: TestBed;
  let httpMock: HttpTestingController;
  let service: DrawingCommunicationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpClientTestingModule],
      providers: [HttpClientModule],
    });

    tesBed = getTestBed();
    httpMock = tesBed.get(HttpTestingController);
    service = tesBed.get(DrawingCommunicationService);

  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('Should return an Observable<DrawingInfo[]> with the correct dummyDrawings', () => {
    const dummyDrawings: DrawingInfo[] = [{
      name: 'testDrawing0',
      typeOfSave: 0,
      canvasInfo: '',
      tags: [],
      primitives: '',
      thumbnail: '',
    },
    {
      name: 'testDrawing1',
      typeOfSave: 0,
      canvasInfo: '',
      tags: [],
      primitives: '',
      thumbnail: '',
    },
    {
      name: 'testDrawing2',
      typeOfSave: 0,
      canvasInfo: '',
      tags: [],
      primitives: '',
      thumbnail: '',
    },
    {
      name: 'testDrawing3',
      typeOfSave: 0,
      canvasInfo: '',
      tags: [{
        id: 17,
        tagName: 'ctu icitte la place des arts',
      }],
      primitives: '',
      thumbnail: '',
    },
    {
      name: '',
      typeOfSave: 0,
      canvasInfo: '',
      tags: [],
      primitives: '',
      thumbnail: '',
    } as DrawingInfo,
    {
      name: 'testDrawing5',
      typeOfSave: 0,
      canvasInfo: '',
      tags: [],
      primitives: '',
      thumbnail: '',
    }];

    service.getAllDrawings().subscribe((drawings) => {
      expect(drawings.length).toBe(6);
      expect(drawings).toEqual(drawings);
    });
    const req = httpMock.expectOne(`${SERVER_BASE_URL}/drawing/`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyDrawings);
  });

  it('Should return an Observable<DrawingInfo[]> with the correct dummyDrawings', () => {
    const dummyDrawings: any[] = [{ }];

    service.getAllDrawings().subscribe((drawings) => {
      expect(drawings.length).toBe(1);
      expect(drawings).toEqual(dummyDrawings);
    });
    const req = httpMock.expectOne(`${SERVER_BASE_URL}/drawing/`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyDrawings);
  });

  it('Should return an Observable<DrawingInfo[]> with the empty dummyDrawings', () => {
    const dummyDrawings: DrawingInfo[] = [];

    service.getAllDrawings().subscribe((drawings) => {
      expect(drawings.length).toBe(0);
      expect(drawings).toEqual(drawings);
    });
    const req = httpMock.expectOne(`${SERVER_BASE_URL}/drawing/`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyDrawings);
  });

  it('should return an error', () => {
    // tslint:disable-next-line: no-empty
    service.getAllDrawings().subscribe(() => {
    }, (error) => {
      expect(error).toBeTruthy();
    });
    const req = httpMock.expectOne(`${SERVER_BASE_URL}/drawing/`);
    req.flush(3);

    // tslint:disable-next-line: no-empty
    service.getAllDrawings().subscribe(() => {
    }, (error) => {
      expect(error).toBeTruthy();
    });
    const req2 = httpMock.expectOne(`${SERVER_BASE_URL}/drawing/`);
    req2.flush('asda');
  });

  it('Should return an Observable<any> after correclty save de drawing', () => {
    const dummyDrawing: DrawingInfo = {
      name: 'testDrawing0',
      typeOfSave: 0,
      canvasInfo: '',
      tags: [],
      primitives: '',
      thumbnail: '',
    };
    service.saveDrawing(dummyDrawing).subscribe((sucess) => {
      expect(sucess).toBeTruthy();
    });
    const req = httpMock.expectOne(`${SERVER_BASE_URL}/drawing/save`);
    expect(req.request.url).toBe(`${SERVER_BASE_URL}/drawing/save`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body.drawingInfo).toEqual(dummyDrawing);
    req.flush([]);
  });

  it('Should return an Observable<any> after correclty save de drawing, verify the params send are correct', () => {
    const dummyDrawing: DrawingInfo = {
      name: 'testDrawing0',
      typeOfSave: 0,
      canvasInfo: '',
      tags: [],
      primitives: '',
      thumbnail: '',
    };
    service.saveDrawing(dummyDrawing).subscribe((sucess) => {
      expect(sucess).toBeTruthy();
    });
    const req = httpMock.expectOne(`${SERVER_BASE_URL}/drawing/save`);
    expect(req.request.url).toBe(`${SERVER_BASE_URL}/drawing/save`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body.drawingInfo).toEqual(dummyDrawing);
    req.flush([]);
  });

  it('should correctly send the subject SVGData', () => {
    service.canvasObservable.subscribe((svgData) => {
      expect(svgData).toBe('Test');
    });

    service.sendSvgHtml('Test');
  });

  it('should correctly send the subject sendSvgHtmlRequest', () => {
    service.exportButtonObservable.subscribe((svgData) => {
      expect(svgData).toBeUndefined();
    });

    service.sendSvgHtmlRequest();
  });
});
