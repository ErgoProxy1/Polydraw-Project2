import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbAlertModule, NgbModalModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { KeyboardShortcutService } from 'src/app/services/keyboardShortcut/keyboard-shortcut.service';
import { DrawingCommunicationService } from 'src/app/services/serverCommunication/drawing-communication.service';
import { TagCommunicationService } from 'src/app/services/serverCommunication/tag-communication.service';
import { TagsInfo } from '../../../../../../common/communication/tags';
import { SaveDrawingComponent } from './save-drawing.component';

describe('SaveDrawingComponent', () => {
  let component: SaveDrawingComponent;
  let fixture: ComponentFixture<SaveDrawingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SaveDrawingComponent],
      providers: [DrawingCommunicationService, TagCommunicationService, KeyboardShortcutService],
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
    expect(component.saveSuccessful).toBe(false);
    expect(component.errorDuringSave).toBe(false);
    expect(component.saveInProgress).toBe(false);
    expect(component.errorInForm).toBe(false);
    expect(component.tagsAllreadyExist).toBe(false);
    expect(component.textSaveButton).toBe('Sauvegarder un dessin');
    expect(component.loading).toBe(false);
    expect(component.currentTagInput).toBe('');
    expect(component.tagsName).toEqual([]);
  });

  it('should set the errorInForm boolean correctly', () => {
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
  });
});
