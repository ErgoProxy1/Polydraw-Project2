import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { KeyboardShortcutService } from 'src/app/services/keyboardShortcut/keyboard-shortcut.service';
import { Color } from 'src/app/services/utils/color';
import { CanvasComponent } from '../canvas/canvas.component';
import { ColorToolComponent } from './color-tool.component';

describe('ColorToolComponent', () => {
  let component: ColorToolComponent;
  let fixture: ComponentFixture<ColorToolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColorToolComponent, CanvasComponent ],
      imports: [FormsModule, ReactiveFormsModule, NgbModule],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Primary/Secondary color are toggled correctly', () => {
    expect(component.primarySelected).toBe(false);
    expect(component.paletteForm.value.hex).toBe('000000');
    expect(component.paletteForm.value.red).toBe(0);
    expect(component.paletteForm.value.green).toBe(0);
    expect(component.paletteForm.value.blue).toBe(0);

    component.colorPrimarySelected();
    expect(component.primarySelected).toBe(true);
    expect(component.paletteForm.value.hex).toBe('000000');
    expect(component.paletteForm.value.red).toBe(0);
    expect(component.paletteForm.value.green).toBe(0);
    expect(component.paletteForm.value.blue).toBe(0);

    component.colorSecondarySelected();
    expect(component.primarySelected).toBe(false);
    expect(component.paletteForm.value.hex).toBe('FFFFFF');
    expect(component.paletteForm.value.red).toBe(255);
    expect(component.paletteForm.value.green).toBe(255);
    expect(component.paletteForm.value.blue).toBe(255);
  });

  it('Colors are applied properly', () => {
    component.primarySelected = true;
    component.paletteForm.patchValue({hex: '80F000'});
    component.applyClickedColor(component.paletteForm);
    expect(component.currentPrimaryHex).toBe('#80F000');

    component.primarySelected = false;
    component.paletteForm.patchValue({hex: 'FAEBDC'});
    component.applyClickedColor(component.paletteForm);
    expect(component.currentSecondaryHex).toBe('#FAEBDC');
  });

  it('Colors and their opacity are properly switched', () => {
    component.currentPrimaryHex = '#123456';
    component.primaryAlpha = 0.75;
    component.currentSecondaryHex = '#6789AB';
    component.secondaryAlpha = 0.25;
    component.switchColor();

    expect(component.currentPrimaryHex).toBe('#6789AB');
    expect(component.primaryAlpha).toEqual(0.25);
    expect(component.currentSecondaryHex).toBe('#123456');
    expect(component.secondaryAlpha).toEqual(0.75);
  });

  it('Hex color is properly converted to RGB (For form display)', () => {
    component.paletteForm.patchValue({hex: '80F000'});
    component.confirmHexColor();
    expect(component.paletteForm.value.red).toEqual(128);
    expect(component.paletteForm.value.green).toEqual(240);
    expect(component.paletteForm.value.blue).toEqual(0);

    component.paletteForm.patchValue({hex: 'FAEBDC'});
    component.confirmHexColor();
    expect(component.paletteForm.value.red).toEqual(250);
    expect(component.paletteForm.value.green).toEqual(235);
    expect(component.paletteForm.value.blue).toEqual(220);
  });

  it('Hex color errors are properly detected', () => {
    component.paletteForm.patchValue({hex: 'A'});
    component.confirmHexColor();
    expect(component.hexError).toBe(true);

    component.paletteForm.patchValue({hex: 'AAAAAA'});
    component.confirmHexColor();
    expect(component.hexError).toBe(false);
  });

  it('RGB color is properly converted to Hex', () => {
    component.paletteForm.patchValue({
      red: 128,
      green: 64,
      blue: 32,
    });
    component.confirmRGBColor();
    expect(component.currentHexSelectedColor).toBe('#804020');

    component.paletteForm.patchValue({
      red: 100,
      green: 143,
      blue: 254,
    });
    component.confirmRGBColor();
    expect(component.currentHexSelectedColor).toBe('#648FFE');
  });

  it('RGB color errors are properly detected', () => {
    component.paletteForm.patchValue({
      red: -1,
      green: 64,
      blue: 32,
    });
    component.confirmRGBColor();
    expect(component.rgbaError).toBe(true);

    component.paletteForm.patchValue({
      red: 0,
      green: 256,
      blue: 32,
    });
    component.confirmRGBColor();
    expect(component.rgbaError).toBe(true);

    component.paletteForm.patchValue({
      red: 128,
      green: 255,
      blue: 0,
    });
    component.confirmRGBColor();
    expect(component.rgbaError).toBe(false);
  });

  it('Opaciy is properly validated', () => {
    component.primaryAlpha = 0.25;
    component.secondaryAlpha = 0.75;
    component.validateAlpha();
    expect(component.primaryAlpha).toBe(0.25);
    expect(component.secondaryAlpha).toBe(0.75);

    component.primaryAlpha = 0.25;
    component.secondaryAlpha = -0.75;
    component.validateAlpha();
    expect(component.primaryAlpha).toBe(0.25);
    expect(component.secondaryAlpha).toBe(0);

    component.primaryAlpha = -0.25;
    component.secondaryAlpha = 0.75;
    component.validateAlpha();
    expect(component.primaryAlpha).toBe(0);
    expect(component.secondaryAlpha).toBe(0.75);

    component.primaryAlpha = 1.25;
    component.secondaryAlpha = 0.75;
    component.validateAlpha();
    expect(component.primaryAlpha).toBe(1);
    expect(component.secondaryAlpha).toBe(0.75);

    component.primaryAlpha = 0.25;
    component.secondaryAlpha = 1.75;
    component.validateAlpha();
    expect(component.primaryAlpha).toBe(0.25);
    expect(component.secondaryAlpha).toBe(1);
  });

  it('Conversion to RGB for color objects is properly done (For internal values)', () => {
    component.currentPrimaryHex = '#FF00AA';
    component.currentSecondaryHex = '#12BC49';
    let expectedPrimary: Color = new Color(255, 0, 170);
    let expectedSecondary: Color = new Color(18, 188, 73);
    component.rgbaConversion();
    expect(component.rgbaPrimaryColor).toEqual(expectedPrimary);
    expect(component.rgbaSecondaryColor).toEqual(expectedSecondary);

    component.currentPrimaryHex = '#3209EB';
    component.currentSecondaryHex = '#1945F1';
    expectedPrimary = new Color(50, 9, 235);
    expectedSecondary = new Color(25, 69, 241);
    component.rgbaConversion();
    expect(component.rgbaPrimaryColor).toEqual(expectedPrimary);
    expect(component.rgbaSecondaryColor).toEqual(expectedSecondary);
  });

  it('New colors are properly added to the stack of previously used colors', () => {
    component.addNewColor('#FF00FF');
    expect(component.lastColorsUsed).toEqual([{positionX: 0, positionY: 0, color: '#FF00FF'}]);

    component.addNewColor('#00FF00');
    expect(component.lastColorsUsed).toEqual([
      {positionX: 0, positionY: 0, color: '#00FF00'},
      {positionX: 40, positionY: 0, color: '#FF00FF'},
    ]);

    component.addNewColor('#123456');
    component.addNewColor('#123457');
    component.addNewColor('#987654');
    component.addNewColor('#000000');
    expect(component.lastColorsUsed).toEqual([
      {positionX: 0, positionY: 0, color: '#000000'},
      {positionX: 40, positionY: 0, color: '#987654'},
      {positionX: 80, positionY: 0, color: '#123457'},
      {positionX: 120, positionY: 0, color: '#123456'},
      {positionX: 160, positionY: 0, color: '#00FF00'},
      {positionX: 0, positionY: 40, color: '#FF00FF'},
    ]);

    component.addNewColor('#AAAAAA');
    component.addNewColor('#BBBBBB');
    component.addNewColor('#CCCCCC');
    component.addNewColor('#DDDDDD');
    expect(component.lastColorsUsed).toEqual([
      {positionX: 0, positionY: 0, color: '#DDDDDD'},
      {positionX: 40, positionY: 0, color: '#CCCCCC'},
      {positionX: 80, positionY: 0, color: '#BBBBBB'},
      {positionX: 120, positionY: 0, color: '#AAAAAA'},
      {positionX: 160, positionY: 0, color: '#000000'},
      {positionX: 0, positionY: 40, color: '#987654'},
      {positionX: 40, positionY: 40, color: '#123457'},
      {positionX: 80, positionY: 40, color: '#123456'},
      {positionX: 120, positionY: 40, color: '#00FF00'},
      {positionX: 160, positionY: 40, color: '#FF00FF'},
    ]);

    component.addNewColor('#FFFFFF');
    expect(component.lastColorsUsed).toEqual([
      {positionX: 0, positionY: 0, color: '#FFFFFF'},
      {positionX: 40, positionY: 0, color: '#DDDDDD'},
      {positionX: 80, positionY: 0, color: '#CCCCCC'},
      {positionX: 120, positionY: 0, color: '#BBBBBB'},
      {positionX: 160, positionY: 0, color: '#AAAAAA'},
      {positionX: 0, positionY: 40, color: '#000000'},
      {positionX: 40, positionY: 40, color: '#987654'},
      {positionX: 80, positionY: 40, color: '#123457'},
      {positionX: 120, positionY: 40, color: '#123456'},
      {positionX: 160, positionY: 40, color: '#00FF00'},
    ]);

    component.addNewColor('#00FF00');
    expect(component.lastColorsUsed).toEqual([
      {positionX: 0, positionY: 0, color: '#FFFFFF'},
      {positionX: 40, positionY: 0, color: '#DDDDDD'},
      {positionX: 80, positionY: 0, color: '#CCCCCC'},
      {positionX: 120, positionY: 0, color: '#BBBBBB'},
      {positionX: 160, positionY: 0, color: '#AAAAAA'},
      {positionX: 0, positionY: 40, color: '#000000'},
      {positionX: 40, positionY: 40, color: '#987654'},
      {positionX: 80, positionY: 40, color: '#123457'},
      {positionX: 120, positionY: 40, color: '#123456'},
      {positionX: 160, positionY: 40, color: '#00FF00'},
    ]);
  });

  it('Modal open/closed correctly detected and transmitted to keyboard shortcuts service', () => {
    const keyboarService: KeyboardShortcutService = TestBed.get(KeyboardShortcutService);
    component.openModal();
    expect(keyboarService.getActiveModalStatus()).toBe(true);

    component.closeModal();
    expect(keyboarService.getActiveModalStatus()).toBe(false);
  });
});
