import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormsModule } from '@angular/forms';
import { TextPropertiesComponent } from './text-properties.component';

describe('TextPropertiesComponent', () => {
  let component: TextPropertiesComponent;
  let fixture: ComponentFixture<TextPropertiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TextPropertiesComponent],
      imports: [FormsModule],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('font is properly changed', () => {
    expect(component.currentFontFamily).toBe(component.FONTS[0].family);
    expect(component.textTool.selectedFont).toBe(0);

    component.onChangeFont('Arial');
    expect(component.currentFontFamily).toBe(component.FONTS[0].family);
    expect(component.textTool.selectedFont).toBe(0);

    component.onChangeFont('Bookman');
    expect(component.currentFontFamily).toBe(component.FONTS[1].family);
    expect(component.textTool.selectedFont).toBe(1);

    component.onChangeFont('Comic Sans');
    expect(component.currentFontFamily).toBe(component.FONTS[2].family);
    expect(component.textTool.selectedFont).toBe(2);

    component.onChangeFont('Courier');
    expect(component.currentFontFamily).toBe(component.FONTS[3].family);
    expect(component.textTool.selectedFont).toBe(3);

    component.onChangeFont('Helvetica');
    expect(component.currentFontFamily).toBe(component.FONTS[4].family);
    expect(component.textTool.selectedFont).toBe(4);

    component.onChangeFont('Times New Roman');
    expect(component.currentFontFamily).toBe(component.FONTS[5].family);
    expect(component.textTool.selectedFont).toBe(5);

    component.onChangeFont('Verdana');
    expect(component.currentFontFamily).toBe(component.FONTS[6].family);
    expect(component.textTool.selectedFont).toBe(6);

    component.onChangeFont('Test_Nonsense');
    expect(component.currentFontFamily).toBe(component.FONTS[6].family);
    expect(component.textTool.selectedFont).toBe(6);
  });

  it('alignment is properly changed', () => {
    expect(component.currentAlign).toEqual(component.ALIGNS[0]);

    component.onChangeAlign('Gauche');
    expect(component.currentAlign).toEqual(component.ALIGNS[0]);

    component.onChangeAlign('Centre');
    expect(component.currentAlign).toEqual(component.ALIGNS[1]);

    component.onChangeAlign('Droite');
    expect(component.currentAlign).toEqual(component.ALIGNS[2]);
  });

  it('text apply is properly called', () => {
    spyOn(component.textTool, 'applyText');

    component.textTool.typing = false;
    component.applyText();
    expect(component.textTool.applyText).not.toHaveBeenCalled();

    component.textTool.typing = true;
    component.applyText();
    expect(component.textTool.applyText).toHaveBeenCalled();
  });
});
