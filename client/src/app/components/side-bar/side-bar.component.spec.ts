import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ColorButtonComponent } from './icones/color-button/color-button.component';
import { PaintBrushButtonComponent } from './icones/paint-brush-button/paint-brush-button.component';
import { PaintBucketButtonComponent } from './icones/paint-bucket-button/paint-bucket-button.component';
import { PencilButtonComponent } from './icones/pencil-button/pencil-button.component';
import { ShapesButtonComponent } from './icones/shapes-button/shapes-button.component';
import { SprayButtonComponent } from './icones/spray-button/spray-button.component';
import { SideBarComponent } from './side-bar.component';

describe('SideBarComponent', () => {
  let component: SideBarComponent;
  let fixture: ComponentFixture<SideBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SideBarComponent,
      PencilButtonComponent,
      PaintBrushButtonComponent,
      PaintBucketButtonComponent,
      ShapesButtonComponent,
      SprayButtonComponent,
      ColorButtonComponent],

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
