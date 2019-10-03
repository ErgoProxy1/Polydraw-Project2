import { TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { ColorService } from './color.service';

describe('ColorSelectionService', () => {
  let service: ColorService;
  beforeAll(() => {TestBed.resetTestEnvironment();
                   TestBed.initTestEnvironment(BrowserDynamicTestingModule,
    platformBrowserDynamicTesting());
                   TestBed.configureTestingModule({});
                   service = TestBed.get(ColorService);
});

  it('should be created', () => {
    const aService: ColorService = TestBed.get(ColorService);
    expect(aService).toBeTruthy();
  });
  it('RGB numbers are properly converted to hex strings' , () => {
    const r = 1;
    const g = 120;
    const b = 78;
    expect(service.convertRgbToHex(r, g, b)).toBe('01784E');
  });
  it('Hex Strings are properly converted to rgb numbers', () => {
    const hexValue = 'AA45BB';
    const rgbNumber: number[] = service.convertHextoRgb(hexValue);
    expect(rgbNumber[0]).toBe(170);
    expect(rgbNumber[1]).toBe(69);
    expect(rgbNumber[2]).toBe(187);
  });
  it('Non-hexadecimal digit are switched to "" ', () => {
    const incorrectDigit1 = 'z';
    const incorrectDigit2 = 'a';
    let correctDigit = 'C';
    correctDigit = service.correctHexInput(correctDigit);
    expect(service.correctHexInput(incorrectDigit1)).toBe('');
    expect(service.correctHexInput(incorrectDigit2)).toBe('');
    expect(service.correctHexInput(correctDigit)).toBe('C');
  });
  it('RGB value errors are properly detected', () => {
    let r = -7;
    const g = 155;
    let b = 300;
    expect(service.confirmRGBColor(r, g, b)).toBe(true);
    r = 144;
    b = 78;
    expect(service.confirmRGBColor(r, g, b)).toBe(false);
  });
  it('strings are properly converted into an hex form', () => {
    const hexValue = '457AB9';
    expect(service.stringToHexForm(hexValue)).toBe('#457AB9');
  });
  it('The alpha is always between 0 and 1' , () => {
    const correctAlpha = 0.5;
    const incorrectAlpha1 = -7;
    const incorrectAlpha2 = 2;
    expect(service.confirmAlpha(correctAlpha)).toBe(0.5);
    expect(service.confirmAlpha(incorrectAlpha1)).toBe(1);
    expect(service.confirmAlpha(incorrectAlpha2)).toBe(1);
  });

});
