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
    expect(keyboardService.validateShortcutEntry('oihaieruhge', keyboardService.SHORTCUT_MAP)).toBe(KeyboardShortcutType.None);
    expect(keyboardService.validateShortcutEntry('-1', keyboardService.SHORTCUT_MAP)).toBe(KeyboardShortcutType.None);
    expect(keyboardService.validateShortcutEntry('4', keyboardService.SHORTCUT_MAP)).toBe(KeyboardShortcutType.None);
    expect(keyboardService.validateShortcutEntry('aiuerhgiurehg', keyboardService.CTRL_SHORTCUT_MAP)).toBe(KeyboardShortcutType.None);
    expect(keyboardService.validateShortcutEntry('4', keyboardService.CTRL_SHORTCUT_MAP)).toBe(KeyboardShortcutType.None);
    expect(keyboardService.validateShortcutEntry('eriugheriuhg', keyboardService.CTRL_SHIFT_SHORTCUT_MAP)).toBe(KeyboardShortcutType.None);
    expect(keyboardService.validateShortcutEntry('4', keyboardService.CTRL_SHIFT_SHORTCUT_MAP)).toBe(KeyboardShortcutType.None);
    // Valeurs recevables
    expect(keyboardService.validateShortcutEntry('c', keyboardService.SHORTCUT_MAP)).toBe(KeyboardShortcutType.Pencil);
    expect(keyboardService.validateShortcutEntry('w', keyboardService.SHORTCUT_MAP)).toBe(KeyboardShortcutType.PaintBrush);
    expect(keyboardService.validateShortcutEntry('o', keyboardService.CTRL_SHORTCUT_MAP)).toBe(KeyboardShortcutType.CreateDrawing);
    expect(keyboardService.validateShortcutEntry('c', keyboardService.CTRL_SHORTCUT_MAP)).toBe(KeyboardShortcutType.Copy);
    expect(keyboardService.validateShortcutEntry('z', keyboardService.CTRL_SHIFT_SHORTCUT_MAP)).toBe(KeyboardShortcutType.Redo);
  });
});
