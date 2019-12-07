import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbAlertModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { TrustPipe } from 'src/app/pipes/trust-html.pipe';
import { ExportDrawingComponent } from './export-drawing/export-drawing.component';
import { HorizontalMenuComponent } from './horizontal-menu.component';
import { NewDrawingComponent } from './new-drawing/new-drawing.component';
import { OpenGalleryComponent } from './open-gallery/open-gallery.component';
import { RedoComponent } from './redo/redo.component';
import { SaveDrawingComponent } from './save-drawing/save-drawing.component';
import { TutorialComponent } from './tutorial/tutorial.component';
import { UndoComponent } from './undo/undo.component';

describe('HorizontalMenuComponent', () => {
  let component: HorizontalMenuComponent;
  let fixture: ComponentFixture<HorizontalMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations:
      [ HorizontalMenuComponent,
        NewDrawingComponent,
        SaveDrawingComponent,
        OpenGalleryComponent,
        ExportDrawingComponent,
        TrustPipe,
        UndoComponent,
        RedoComponent,
        TutorialComponent,
      ],
      imports: [ FormsModule, ReactiveFormsModule, NgbAlertModule, NgbTypeaheadModule, HttpClientModule],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HorizontalMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
