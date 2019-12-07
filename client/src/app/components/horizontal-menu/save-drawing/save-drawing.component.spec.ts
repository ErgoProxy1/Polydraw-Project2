import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbAlertModule, NgbModalModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { KeyboardService } from 'src/app/services/keyboard/keyboard.service';
import { DrawingCommunicationService } from 'src/app/services/serverCommunication/drawing-communication.service';
import { TagCommunicationService } from 'src/app/services/serverCommunication/tag-communication.service';
import { DrawingInfo } from '../../../../../../common/communication/drawingInfo';
import { TagsInfo } from '../../../../../../common/communication/tags';
import { SaveDrawingComponent } from './save-drawing.component';

describe('SaveDrawingComponent', () => {
  let component: SaveDrawingComponent;
  let fixture: ComponentFixture<SaveDrawingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SaveDrawingComponent],
      providers: [DrawingCommunicationService, TagCommunicationService, KeyboardService],
      imports: [FormsModule, ReactiveFormsModule, NgbModalModule, NgbAlertModule, NgbTypeaheadModule, HttpClientModule],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveDrawingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be defined', () => {
    expect(component).toBeDefined();
  });

  it('should set the attributes correctly at launch', () => {
    expect(component.errorInForm).toBe(false);
    expect(component.tagsAllreadyExist).toBe(false);
    expect(component.textSaveButton).toBe('Sauvegarder un dessin');
    expect(component.loading).toBe(false);
    expect(component.currentTagInput).toBe('');
  });

  it('should set variables correctly when modal is brought up', () => {
    const keyboardService: KeyboardService = TestBed.get(KeyboardService);
    const drawing: DrawingInfo = {
      name: 'Nouveau Dessin',
      typeOfSave: 0,
      primitives: '[]',
      tags: [],
      canvasInfo: '{"width":0,"height":0,"color":{"rgbaTextForm":"none","r":0,"g":0,"b":0,"a":0}}',
      thumbnail: '',
    };
    component.openModal();
    expect(component.loading).toBe(true);
    expect(component.drawingInfo).toEqual(drawing);
    expect(keyboardService.modalWindowActive).toBe(true);
  });

  it('should set the errorInForm boolean correctly', () => {
    // Nom vide
    component.drawingInfo = {
      name: '',
      typeOfSave: 1,
      canvasInfo: '',
      tags: [],
      primitives: '',
      thumbnail: '',
    };
    component.checkErrorsInForm();
    expect(component.errorInForm).toBe(true);
    component.errorInForm = false;
    // Ces informations sont acceptables (pas d'erreur)
    component.drawingInfo = {
      name: 'test',
      typeOfSave: 0,
      canvasInfo: '',
      tags: [],
      primitives: '',
      thumbnail: '',
    };
    component.checkErrorsInForm();
    expect(component.errorInForm).toBe(false);
    component.errorInForm = false;
    // nom trop long
    component.drawingInfo = {
      name: 'oijraeogijareiguhaerlgiuhaelrgiuharelgiaurheglaieuhrglriaeuhgaerliughraeliguhraelgiuaheglfihaerg',
      typeOfSave: 1,
      canvasInfo: '',
      tags: [],
      primitives: '',
      thumbnail: '',
    };
    component.checkErrorsInForm();
    expect(component.errorInForm).toBe(true);
    component.errorInForm = false;
    // type invalide
    component.drawingInfo = {
      name: 'test3',
      typeOfSave: -1,
      canvasInfo: '',
      tags: [],
      primitives: '',
      thumbnail: '',
    };
    component.checkErrorsInForm();
    expect(component.errorInForm).toBe(true);
    component.errorInForm = false;
  });

  it('should addNewTag correctly', () => {
    // Empty current tags
    component.drawingInfo = {
      name: 'test',
      typeOfSave: 0,
      canvasInfo: '',
      tags: [],
      primitives: '',
      thumbnail: '',
    };
    component.drawingInfo.tags = [];
    component.tags = [];

    // New random tag
    component.currentTagInput = 'hffhhfg';
    component.addNewTag();
    expect(component.drawingInfo.tags.length).toEqual(1);
    expect(component.drawingInfo.tags[0].tagName).toBe('hffhhfg');

    // Should not add
    component.currentTagInput = 'hffhhfg';
    component.addNewTag();
    expect(component.drawingInfo.tags.length).toEqual(1);
    expect(component.drawingInfo.tags[0].tagName).toBe('hffhhfg');
  });

  it('should removeTag correctly', () => {
    // Empty current tags
    component.drawingInfo = {
      name: 'test',
      typeOfSave: 0,
      canvasInfo: '',
      tags: [],
      primitives: '',
      thumbnail: '',
    };
    component.drawingInfo.tags = [];
    component.tags = [];
    // Un tag
    let tag: TagsInfo;
    tag = {
      id: -1,
      tagName: 'hffhhfg',
    };
    component.drawingInfo.tags.push(tag);
    component.removeTag(tag);
    expect(component.drawingInfo.tags.length).toEqual(0);
    // Plusieurs tags
    component.drawingInfo.tags = [];
    let tag1: TagsInfo;
    let tag2: TagsInfo;
    let tag3: TagsInfo;
    tag1 = {
      id: -1,
      tagName: 'test1',
    };
    tag2 = {
      id: -1,
      tagName: 'test2',
    };
    tag3 = {
      id: -1,
      tagName: 'test3',
    };
    component.drawingInfo.tags.push(tag1);
    component.drawingInfo.tags.push(tag2);
    component.drawingInfo.tags.push(tag3);
    component.removeTag(tag2);
    expect(component.drawingInfo.tags.length).toEqual(2);
    expect(component.drawingInfo.tags).toContain(tag1);
  });
});
