import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { EraserButtonComponent } from './icones/eraser-button/eraser-button.component';
import { EyedropperButtonComponent } from './icones/eyedropper-button/eyedropper-button.component';
import { GridButtonComponent } from './icones/grid-button/grid-button.component';
// import { ColorButtonComponent } from './icones/color-button/color-button.component';
import { LineButtonComponent } from './icones/line-button/line-button.component';
import { PaintBrushButtonComponent } from './icones/paint-brush-button/paint-brush-button.component';
import { PaintBucketButtonComponent } from './icones/paint-bucket-button/paint-bucket-button.component';
import { PenButtonComponent } from './icones/pen-button/pen-button.component';
import { PencilButtonComponent } from './icones/pencil-button/pencil-button.component';
import { SelectionButtonComponent } from './icones/selection-button/selection-button.component';
import { ShapesButtonComponent } from './icones/shapes-button/shapes-button.component';
import { SprayButtonComponent } from './icones/spray-button/spray-button.component';
import { StampButtonComponent } from './icones/stamp-button/stamp-button.component';
import { TextButtonComponent } from './icones/text-button/text-button.component';
import { SideBarComponent } from './side-bar.component';

describe('SideBarComponent', () => {
  let component: SideBarComponent;
  let fixture: ComponentFixture<SideBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SideBarComponent,
      PencilButtonComponent,
      PenButtonComponent,
      PaintBrushButtonComponent,
      PaintBucketButtonComponent,
      LineButtonComponent,
      ShapesButtonComponent,
      SprayButtonComponent,
      EyedropperButtonComponent,
      StampButtonComponent,
      SelectionButtonComponent,
      GridButtonComponent,
      EraserButtonComponent,
      TextButtonComponent],

      imports: [FontAwesomeModule, RouterTestingModule],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SideBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
