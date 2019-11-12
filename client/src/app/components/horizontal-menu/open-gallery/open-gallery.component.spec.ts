import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbAlertModule, NgbModalModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { TrustPipe } from 'src/app/pipes/trust-html.pipe';
import { ControllerService } from 'src/app/services/controller/controller.service';
import { DrawingHandlerService } from 'src/app/services/drawingHandler/drawing-handler.service';
import { KeyboardService } from 'src/app/services/keyboard/keyboard.service';
import { DrawingCommunicationService } from 'src/app/services/serverCommunication/drawing-communication.service';
import { TagCommunicationService } from 'src/app/services/serverCommunication/tag-communication.service';
import { SVGPrimitive } from 'src/app/services/svgPrimitives/svgPrimitive';
import { Color } from 'src/app/services/utils/color';
import { NewDrawingInfo } from 'src/app/services/utils/newDrawingInfo';
import { DrawingInfo } from '../../../../../../common/communication/drawingInfo';
import { TagsInfo } from '../../../../../../common/communication/tags';
import { OpenGalleryComponent } from './open-gallery.component';

describe('OpenGalleryComponent', () => {
  let component: OpenGalleryComponent;
  let fixture: ComponentFixture<OpenGalleryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OpenGalleryComponent, TrustPipe],
      providers: [KeyboardService, ControllerService, DrawingCommunicationService, TagCommunicationService, DrawingHandlerService],
      imports: [FormsModule, ReactiveFormsModule, NgbModalModule, NgbAlertModule, NgbTypeaheadModule, HttpClientModule],
    })
    .compileComponents();
    fixture = TestBed.createComponent(OpenGalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenGalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set controller information correctly after selectDrawing is called', () => {
    const controllerService: ControllerService = TestBed.get(ControllerService);
    controllerService.canvasInfo = new NewDrawingInfo(0, 0, new Color(0, 0, 0, 0));
    const emptyPrimitives: SVGPrimitive[] = [];
    const drawingInfo = new NewDrawingInfo(1554, 638, new Color(0, 0, 0, 0));
    const drawing: DrawingInfo = {
      name: 'test',
       typeOfSave: 0,
      canvasInfo: '',
      tags: [],
      primitives: '',
      thumbnail: '',
    };
    drawing.canvasInfo = JSON.stringify(drawingInfo);
    drawing.primitives = JSON.stringify(emptyPrimitives);
    component.selectDrawing(drawing);
    expect(controllerService.canvasInfo.width).toEqual(1554);
    expect(controllerService.canvasInfo.height).toEqual(638);
    expect(controllerService.svgPrimitives).toEqual([]);
  });

  it('should reset the current drawing values when modal is brought up', () => {
    const keyboardService: KeyboardService = TestBed.get(KeyboardService);
    component.openModal();
    expect(component.drawingsToShow).toEqual([]);
    expect(component.loading).toBe(true);
    expect(component.currentTagInput).toEqual('');
    expect(component.tagsSelected).toEqual([]);
    expect(component.limitToEight).toBe(true);
    expect(component.limitToShow).toEqual(8);
    expect(keyboardService.modalWindowActive).toBe(true);
  });

  it('should return correct tag string', () => {
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
    expect(component.getTagString(emptyTagDrawing)).toEqual('Aucune étiquette');
    expect(component.getTagString(drawing)).toEqual('Étiquettes: test');
  });

  it('should remove a tag from the list', () => {
    const testTag: TagsInfo = {
      id: 1,
      tagName: 'testTag1',
    };
    const testTagTab: TagsInfo[] = [testTag];
    component.tagsSelected = testTagTab;
    component.removeTag(testTag);
    expect(component.tagsSelected.length).toEqual(0);

    const testTag2: TagsInfo = {
      id: 2,
      tagName: 'testTag2',
    };
    const testTag3: TagsInfo = {
      id: 3,
      tagName: 'testTag3',
    };
    const testTagsTab: TagsInfo[] = [testTag, testTag2, testTag3];
    component.tagsSelected = testTagsTab;
    component.removeTag(testTag3);
    expect(component.tagsSelected.length).toEqual(2);
    expect(component.tagsSelected).not.toContain(testTag3);
    expect(component.tagsSelected).toContain(testTag);
  });

  it('should correctly limit drawings to show by default and not if changed', () => {
    component.drawingsToShow = [];
    component.showMoreOrLess();
    expect(component.limitToShow).toEqual(8);
    component.drawingsToShow = [
      {
        name: 'test1',
        typeOfSave: 0,
        canvasInfo: '',
        tags: [],
        primitives: '',
        thumbnail: '',
      },
      {
        name: 'test2',
        typeOfSave: 0,
        canvasInfo: '',
        tags: [],
        primitives: '',
        thumbnail: '',
      },
      {
        name: 'test3',
        typeOfSave: 0,
        canvasInfo: '',
        tags: [],
        primitives: '',
        thumbnail: '',
      },
      {
        name: 'test4',
        typeOfSave: 0,
        canvasInfo: '',
        tags: [],
        primitives: '',
        thumbnail: '',
      },
      {
        name: 'test5',
        typeOfSave: 0,
        canvasInfo: '',
        tags: [],
        primitives: '',
        thumbnail: '',
      },
      {
        name: 'test6',
        typeOfSave: 0,
        canvasInfo: '',
        tags: [],
        primitives: '',
        thumbnail: '',
      },
      {
         name: 'test7',
        typeOfSave: 0,
        canvasInfo: '',
        tags: [],
        primitives: '',
        thumbnail: '',
      },
      {
        name: 'test8',
        typeOfSave: 0,
        canvasInfo: '',
        tags: [],
        primitives: '',
        thumbnail: '',
      },
      {
        name: 'test9',
        typeOfSave: 0,
        canvasInfo: '',
        tags: [],
        primitives: '',
        thumbnail: '',
      },
      {
        name: 'test10',
        typeOfSave: 0,
        canvasInfo: '',
        tags: [],
        primitives: '',
        thumbnail: '',
      },
     ];
    component.limitToEight = false;
    component.showMoreOrLess();
    expect(component.limitToShow).toEqual(10);
  });

  it('should limit drawingsToShow after filtering', () => {
    const drawingHandlerService: DrawingHandlerService = TestBed.get(DrawingHandlerService);
    // If no filter
    const testDrawings: DrawingInfo[] = [{
        name: 'test',
        typeOfSave: 0,
        canvasInfo: '',
        tags: [{
          id: 0,
          tagName: 'testTag',
        }],
        primitives: '',
        thumbnail: '',
      },
      {
        name: 'test2',
        typeOfSave: 0,
        canvasInfo: '',
        tags: [{
          id: 1,
          tagName: 'helloWorld',
        }],
        primitives: '',
        thumbnail: '',
      },
      {
        name: 'test3',
        typeOfSave: 0,
        canvasInfo: '',
        tags: [{
          id: 0,
          tagName: 'testTag',
        },
        {
          id: 2,
          tagName: 'anotherTag',
        }],
        primitives: '',
        thumbnail: '',
      },
    ];
    drawingHandlerService.drawings = testDrawings;
    component.tagsSelected = [];
    component.filterDrawings();
    expect(component.drawingsToShow.length).toEqual(3);

    // If a filter is applied
    component.tagsSelected = [{
      id: 0,
      tagName: 'testTag',
    }];
    component.filterDrawings();
    expect(component.drawingsToShow.length).toEqual(2);
  });

  it('should correctly set the variables when modal is closed', () => {
    const keyboardService: KeyboardService = TestBed.get(KeyboardService);
    expect(component.closeModal()).toBe(false);
    component.closeModal();
    expect(keyboardService.modalWindowActive).toBe(false);
  });
});
