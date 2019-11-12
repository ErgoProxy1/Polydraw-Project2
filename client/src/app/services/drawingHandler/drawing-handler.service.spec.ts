import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { DrawingInfo } from '../../../../../common/communication/drawingInfo';
import { TagsInfo } from '../../../../../common/communication/tags';
import { TagHandlerService } from '../tagHandler/tag-handler.service';
import { DrawingHandlerService } from './drawing-handler.service';

describe('DrawingHandlerService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientModule],
    providers: [DrawingHandlerService, TagHandlerService],
}));

  it('should be created', () => {
    const service: DrawingHandlerService = TestBed.get(DrawingHandlerService);
    expect(service).toBeTruthy();
  });

  it('should filter drawings correctly', () => {
    const service: DrawingHandlerService = TestBed.get(DrawingHandlerService);
    const testTags: TagsInfo[] = [{
      id: 0,
      tagName: 'testtag0',
    },
    {
      id: 1,
      tagName: 'testtag1',
    },
    {
      id: 2,
      tagName: 'testtag2',
    }];
    const testDrawings: DrawingInfo[] = [{
      // tags vides
      name: 'testDrawing0',
      typeOfSave: 0,
      canvasInfo: '',
      tags: [],
      primitives: '',
      thumbnail: '',
    },
    // un tag
    {
      name: 'testDrawing1',
      typeOfSave: 0,
      canvasInfo: '',
      tags: [testTags[0]],
      primitives: '',
      thumbnail: '',
    },
    // deux tags
    {
      name: 'testDrawing2',
      typeOfSave: 0,
      canvasInfo: '',
      tags: [testTags[0], testTags[1]],
      primitives: '',
      thumbnail: '',
    },
    // un tag erroné
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
    // tags en désordre
    {
      name: 'testDrawing4',
      typeOfSave: 0,
      canvasInfo: '',
      tags: [testTags[2], testTags[1]],
      primitives: '',
      thumbnail: '',
    },
    {
      name: 'testDrawing5',
      typeOfSave: 0,
      canvasInfo: '',
      tags: [testTags[2], testTags[0], testTags[1]],
      primitives: '',
      thumbnail: '',
    }];
    service.drawings = testDrawings;
    expect(service.filterDrawingsByTags(testTags).length).toEqual(1);
    const testPartiel0: TagsInfo[] = [testTags[0]];
    const resultat0 = service.filterDrawingsByTags(testPartiel0);
    expect(resultat0).toContain(testDrawings[1]);
    expect(resultat0).toContain(testDrawings[2]);
    expect(resultat0).toContain(testDrawings[5]);
    const testPartiel01: TagsInfo[] = [testTags[0], testTags[1]];
    const resultat01 = service.filterDrawingsByTags(testPartiel01);
    expect(resultat01).toContain(testDrawings[5]);
    expect(resultat01).toContain(testDrawings[2]);
    expect(resultat01).not.toContain(testDrawings[1]);
    const testPartiel2: TagsInfo[] = [testTags[2]];
    expect(testPartiel2.length).toEqual(1);
    const testErrone: TagsInfo[] = [{
      id: -1,
      tagName: '',
    }];
    expect(service.filterDrawingsByTags(testErrone).length).toEqual(0);
  });
});
