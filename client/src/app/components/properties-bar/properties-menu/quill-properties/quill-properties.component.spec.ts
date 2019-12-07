// tslint:disable
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { QuillPropertiesComponent } from './quill-properties.component';

describe('QuillPropertiesComponent', () => {
  let component: QuillPropertiesComponent;
  let fixture: ComponentFixture<QuillPropertiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [QuillPropertiesComponent],
      imports: [FormsModule, HttpClientModule],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuillPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('quill length is properly changed', () => {
    component.quillLength = 15;
    component.onChangeQuillLength();
    expect(component.quill.baseLength).toBe(15);

    component.quillLength = -10;
    component.onChangeQuillLength();
    expect(component.quill.baseLength).toBe(1);

    component.quillLength = 150;
    component.onChangeQuillLength();
    expect(component.quill.baseLength).toBe(50);

  });

  it('quill angle is properly changed', () => {
    component.rotationAngle = 15;
    component.onChangeRotation();
    expect(component.quill.angle).toBe(15);

    component.rotationAngle = -10;
    component.onChangeRotation();
    expect(component.quill.angle).toBe(0);

    component.rotationAngle = 400;
    component.onChangeRotation();
    expect(component.quill.angle).toBe(359);
  });

  it('angle received from tool is properly changed', () => {
    component.quill.angle = 15;
    component.quill['sendQuillAngleToProperties']();
    expect(component.rotationAngle).toBe(15);

    component.quill.angle = -10;
    component.quill['sendQuillAngleToProperties']();
    expect(component.rotationAngle).toBe(350);

    component.quill.angle = 400;
    component.quill['sendQuillAngleToProperties']();
    expect(component.rotationAngle).toBe(0);
  });
});
