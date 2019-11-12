import { TestBed } from '@angular/core/testing';
import { KeyboardShortcutType } from '../utils/constantsAndEnums';
import { KeyboardService } from './keyboard.service';

describe('KeyboardService', () => {
  let keyboardService: KeyboardService;

  beforeEach(() => {
    keyboardService = new KeyboardService();
    TestBed.configureTestingModule({
      providers: [KeyboardService],
    });
  });

  it('should be created', () => {
    const keybdService: KeyboardService = TestBed.get(KeyboardService);
    expect(keybdService).toBeTruthy();
  });

  it('validateEntry should return the correct KeyboardShortcutType', () => {
    // Valeurs de string indéfinies
    expect(keyboardService.validateShortcutEntry('oihaieruhge', keyboardService.shortcutMap)).toBe(KeyboardShortcutType.None);
    expect(keyboardService.validateShortcutEntry('-1', keyboardService.shortcutMap)).toBe(KeyboardShortcutType.None);
    expect(keyboardService.validateShortcutEntry('4', keyboardService.shortcutMap)).toBe(KeyboardShortcutType.None);
    expect(keyboardService.validateShortcutEntry('aiuerhgiurehg', keyboardService.ctrlShortcutMap)).toBe(KeyboardShortcutType.None);
    expect(keyboardService.validateShortcutEntry('4', keyboardService.ctrlShortcutMap)).toBe(KeyboardShortcutType.None);
    expect(keyboardService.validateShortcutEntry('eriugheriuhg', keyboardService.ctrlShiftShortcutMap)).toBe(KeyboardShortcutType.None);
    expect(keyboardService.validateShortcutEntry('4', keyboardService.ctrlShiftShortcutMap)).toBe(KeyboardShortcutType.None);
    // Valeurs recevables
    expect(keyboardService.validateShortcutEntry('c', keyboardService.shortcutMap)).toBe(KeyboardShortcutType.Pencil);
    expect(keyboardService.validateShortcutEntry('w', keyboardService.shortcutMap)).toBe(KeyboardShortcutType.PaintBrush);
    expect(keyboardService.validateShortcutEntry('o', keyboardService.ctrlShortcutMap)).toBe(KeyboardShortcutType.CreateDrawing);
    expect(keyboardService.validateShortcutEntry('c', keyboardService.ctrlShortcutMap)).toBe(KeyboardShortcutType.Copy);
    expect(keyboardService.validateShortcutEntry('z', keyboardService.ctrlShiftShortcutMap)).toBe(KeyboardShortcutType.Redo);
  });
});
