import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { DrawingInfo } from '../../../../../common/communication/drawingInfo';
import { TagsInfo } from '../../../../../common/communication/tags';
import { TagCommunicationService } from '../serverCommunication/tag-communication.service';
import { TagHandlerService } from './tag-handler.service';

describe('TagHandlerServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [TagHandlerService, TagCommunicationService],
  }));

  it('should be created', () => {
    const service: TagHandlerService = TestBed.get(TagHandlerService);
    expect(service).toBeTruthy();
  });

  it('should correctly return if tag already exists or not', () => {
    const service: TagHandlerService = TestBed.get(TagHandlerService);
    const testTags: TagsInfo[] = [{
      id: 1,
      tagName: 'testTag',
    }];
    expect(service.isTagPresent('testTag', testTags)).toBe(true);
    expect(service.isTagPresent('iugeahriughareiugaerg', testTags)).toBe(false);
  });

  it('should correctly filter strings array by string', () => {
    const service: TagHandlerService = TestBed.get(TagHandlerService);
    const tagsNameArray: string[] = ['test0', 'test1', 'autre', 'zzzzz'];
    const tagsNameArrayFiltered: string[] = ['test0', 'test1'];
    service.tagsName = tagsNameArray;
    expect(service.filterTagsName('')).toEqual(tagsNameArray);
    expect(service.filterTagsName('test')).toEqual(tagsNameArrayFiltered);
    expect(service.filterTagsName('testing')).toEqual([]);
  });

  it('should return correct boolean when comparing two tags tables', () => {
    const service: TagHandlerService = TestBed.get(TagHandlerService);
    const testTagsInTrue: TagsInfo[] = [{
      id: 0,
      tagName: '',
    },
    {
      id: 1,
      tagName: '',
    },
    {
      id: 2,
      tagName: '',
    },
    {
      id: 3,
      tagName: '',
    }];
    const testTagsRef: TagsInfo[] = [{
      id: 0,
      tagName: '',
    },
    {
      id: 1,
      tagName: '',
    },
    {
      id: 2,
      tagName: '',
    },
    {
      id: 3,
      tagName: '',
    }];
    // Ici, le test devrait passer, car la validation des noms est déjà faite
    const testTagsInTrueDiffName: TagsInfo[] = [{
      id: 0,
      tagName: 'testTag0',
    },
    {
      id: 1,
      tagName: 'testTag1',
    },
    {
      id: 2,
      tagName: 'testTag2',
    },
    {
      id: 3,
      tagName: 'testTag3',
    }];
    const testTagsEmpty: TagsInfo[] = [];
    expect(service.areAllTagPresent(testTagsInTrue, testTagsRef)).toBe(true);
    expect(service.areAllTagPresent(testTagsRef, testTagsEmpty)).toBe(false);
    expect(service.areAllTagPresent(testTagsInTrueDiffName, testTagsRef)).toBe(true);
  });

  it('should correctly convert selected tags to string', () => {
    const service: TagHandlerService = TestBed.get(TagHandlerService);
    const emptyTags: TagsInfo[] = [];
    const emptyTagDrawing: DrawingInfo = {
      name: 'test',
      typeOfSave: 0,
      canvasInfo: '',
      tags: [],
      primitives: '',
      thumbnail: '',
    };
    const drawing: DrawingInfo = {
      name: 'test',
      typeOfSave: 0,
      canvasInfo: '',
      tags: [{
        id: 1,
        tagName: 'test',
      }],
      primitives: '',
      thumbnail: '',
    };
    const testTag: TagsInfo = {
      id: 1,
      tagName: 'test',
    };
    expect(service.convertTagSelectedToString(emptyTagDrawing.tags, emptyTags)).toEqual('Aucune étiquette');
    expect(service.convertTagSelectedToString(drawing.tags, emptyTags)).toEqual('Étiquettes: test');
    expect(service.convertTagSelectedToString(drawing.tags, [testTag])).toEqual('Étiquettes: <mark><b>test</b></mark>');
  });

  it('should return correct TagsInfo when searching with a string', () => {
    const service: TagHandlerService = TestBed.get(TagHandlerService);
    service.allTags = [{
      id: 0,
      tagName: 'testTag0',
    },
    {
      id: 1,
      tagName: 'testTag1',
    }];
    expect(service.getTag('test')).toEqual({
      id: -1,
      tagName: 'test',
    });
    expect(service.getTag('testTag0')).toEqual({
      id: 0,
      tagName: 'testTag0',
    });
  });
});
