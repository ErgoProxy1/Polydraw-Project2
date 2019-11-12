import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { KeyboardService } from 'src/app/services/keyboard/keyboard.service';
import { DrawingService } from '../../../services/drawing/drawing.service';
import { NewDrawingComponent } from './new-drawing.component';

describe('NewDrawingComponent', () => {
  let component: NewDrawingComponent;
  let fixture: ComponentFixture<NewDrawingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NewDrawingComponent],
      providers: [FormBuilder, DrawingService],
      imports: [FormsModule, ReactiveFormsModule, NgbModalModule],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewDrawingComponent],
      providers: [FormBuilder, DrawingService],
      imports: [FormsModule, ReactiveFormsModule, NgbModalModule],
    });
    fixture = TestBed.createComponent(NewDrawingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Booleans for input errors should be initially set to false', () => {
    expect(component.errorInColors).toBe(false);
    expect(component.errorsInDimensions).toBe(false);
  });

  it('resetForm() method sets correct values', () => {
    component.workspaceDimensions = [128, 64];
    component.resetForm();
    expect(component.drawingForm.value.width).toBe(128);
    expect(component.drawingForm.value.height).toBe(64);
    expect(component.drawingForm.value.red).toBe(255);
    expect(component.drawingForm.value.green).toBe(255);
    expect(component.drawingForm.value.blue).toBe(255);
    expect(component.drawingForm.value.alpha).toBe(1);
    expect(component.drawingForm.value.hex).toBe('FFFFFF');
    expect(component.currentColorHex).toBe('#FFFFFF');
    expect(component.drawingForm.dirty).toBe(false);
  });

  it('Errors in dimensions are properly detected', () => {
    component.workspaceDimensions = [128, 64];
    component.resetForm();
    expect(component.checkDimensionValues()).toBe(true);
    expect(component.errorsInDimensions).toBe(false);

    component.workspaceDimensions = [-128, 64];
    component.resetForm();
    expect(component.checkDimensionValues()).toBe(false);
    expect(component.errorsInDimensions).toBe(true);

    component.workspaceDimensions = [128, 64];
    component.resetForm();
    expect(component.checkDimensionValues()).toBe(true);
    expect(component.errorsInDimensions).toBe(false);

    component.workspaceDimensions = [128, 49];
    component.resetForm();
    expect(component.checkDimensionValues()).toBe(false);
    expect(component.errorsInDimensions).toBe(true);

    component.workspaceDimensions = [128, 64];
    component.resetForm();
    expect(component.checkDimensionValues()).toBe(true);
    expect(component.errorsInDimensions).toBe(false);

    component.workspaceDimensions = [12800, 64];
    component.resetForm();
    expect(component.checkDimensionValues()).toBe(false);
    expect(component.errorsInDimensions).toBe(true);
  });

  it('Form submits correct values', () => {
    component.workspaceDimensions = [128, 64];
    component.resetForm();
    component.newDrawing(component.drawingForm);
    expect(component.newDrawingInfo.width).toBe(128);
    expect(component.newDrawingInfo.height).toBe(64);
    expect(component.newDrawingInfo.color.r).toBe(255);
    expect(component.newDrawingInfo.color.g).toBe(255);
    expect(component.newDrawingInfo.color.b).toBe(255);
    expect(component.newDrawingInfo.color.a).toBe(1);
  });

  it('Conversion from RGB to HEX is correct', () => {
    component.drawingForm.patchValue({
      red: 0,
      green: 0,
      blue: 255,
    });
    component.confirmRGBColor();
    expect(component.drawingForm.value.hex).toBe('0000FF');
    expect(component.currentColorHex).toBe('#0000FF');

    component.drawingForm.patchValue({
      red: 128,
      green: 64,
      blue: 32,
    });
    component.confirmRGBColor();
    expect(component.drawingForm.value.hex).toBe('804020');
    expect(component.currentColorHex).toBe('#804020');

    component.drawingForm.patchValue({
      red: 1,
      green: 255,
      blue: 90,
    });
    component.confirmRGBColor();
    expect(component.drawingForm.value.hex).toBe('01FF5A');
    expect(component.currentColorHex).toBe('#01FF5A');
  });

  it('Errors in RGB colors are properly detected', () => {
    component.drawingForm.patchValue({
      red: 128,
      green: 64,
      blue: 32,
    });
    component.confirmRGBColor();
    expect(component.errorInColors).toBe(false);

    component.drawingForm.patchValue({
      red: -128,
      green: 64,
      blue: 32,
    });
    component.confirmRGBColor();
    expect(component.errorInColors).toBe(true);

    component.drawingForm.patchValue({
      red: 128,
      green: 64,
      blue: 32,
    });
    component.confirmRGBColor();
    expect(component.errorInColors).toBe(false);

    component.drawingForm.patchValue({
      red: 128,
      green: -64,
      blue: -32,
    });
    component.confirmRGBColor();
    expect(component.errorInColors).toBe(true);
  });

  it('Alpha is properly read and corrected', () => {
    component.drawingForm.patchValue({ alpha: 1 });
    component.confirmAlpha();
    expect(component.drawingForm.value.alpha).toEqual(1);

    component.drawingForm.patchValue({ alpha: 0 });
    component.confirmAlpha();
    expect(component.drawingForm.value.alpha).toEqual(0);

    component.drawingForm.patchValue({ alpha: -1 });
    component.confirmAlpha();
    expect(component.drawingForm.value.alpha).toEqual(1);

    component.drawingForm.patchValue({ alpha: 0.45 });
    component.confirmAlpha();
    expect(component.drawingForm.value.alpha).toEqual(0.45);

    component.drawingForm.patchValue({ alpha: 2 });
    component.confirmAlpha();
    expect(component.drawingForm.value.alpha).toEqual(1);
  });

  it('Hex input is properly corrected', () => {
    component.drawingForm.patchValue({ hex: '10a0Ff' });
    component.correctHexInput();
    expect(component.drawingForm.value.hex).toBe('10A0FF');

    component.drawingForm.patchValue({ hex: 'Q' });
    component.correctHexInput();
    expect(component.drawingForm.value.hex).toBe('');
  });

  it('Conversion from RGB to HEX is correct', () => {
    component.drawingForm.patchValue({ hex: '000000' });
    component.confirmHexColor();
    expect(component.drawingForm.value.red).toEqual(0);
    expect(component.drawingForm.value.green).toEqual(0);
    expect(component.drawingForm.value.blue).toEqual(0);

    component.drawingForm.patchValue({ hex: '804020' });
    component.confirmHexColor();
    expect(component.drawingForm.value.red).toEqual(128);
    expect(component.drawingForm.value.green).toEqual(64);
    expect(component.drawingForm.value.blue).toEqual(32);

    component.drawingForm.patchValue({ hex: 'ABCDEF' });
    component.confirmHexColor();
    expect(component.drawingForm.value.red).toEqual(171);
    expect(component.drawingForm.value.green).toEqual(205);
    expect(component.drawingForm.value.blue).toEqual(239);
  });

  it('Errors in HEX colors are properly detected', () => {
    component.drawingForm.patchValue({ hex: '000000' });
    component.confirmHexColor();
    expect(component.errorInColors).toBe(false);

    component.drawingForm.patchValue({ hex: 'A' });
    component.confirmHexColor();
    expect(component.errorInColors).toBe(true);

    component.drawingForm.patchValue({ hex: 'FFFFFF' });
    component.confirmHexColor();
    expect(component.errorInColors).toBe(false);

    component.drawingForm.patchValue({ hex: '12345' });
    component.confirmHexColor();
    expect(component.errorInColors).toBe(true);
  });

  it('Resent dimensions are properly read and confirmed', () => {
    let dimensions: number[] = [128, 64];
    component.drawingForm.markAsPristine();
    component.confirmResentDimensions(dimensions);
    expect(component.workspaceDimensions).toEqual([128, 64]);
    expect(component.drawingForm.value.width).toEqual(128);
    expect(component.drawingForm.value.height).toEqual(64);

    dimensions = [256, 128];
    component.drawingForm.markAsDirty();
    component.confirmResentDimensions(dimensions);
    expect(component.workspaceDimensions).toEqual([128, 64]);
    expect(component.drawingForm.value.width).toEqual(128);
    expect(component.drawingForm.value.height).toEqual(64);
  });

  it('Modal active status is correctly detected and transmitted for keyboard shortcuts service', () => {
    const keyboardService: KeyboardService = TestBed.get(KeyboardService);
    component.openModal();
    expect(keyboardService.modalWindowActive).toBe(true);
    component.closeModal();
    keyboardService.inputFocusedActive = false;
    expect(keyboardService.modalWindowActive).toBe(false);
  });

});
