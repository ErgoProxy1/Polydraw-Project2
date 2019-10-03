import { TestBed } from '@angular/core/testing';
import { KeyboardShortcutType } from '../utils/constantsAndEnums';
import { KeyboardShortcutService } from './keyboard-shortcut.service';

describe('KeyboardShortcutService', () => {
  let keyboardService: KeyboardShortcutService;

  beforeEach(() => {
    keyboardService = new KeyboardShortcutService();
    TestBed.configureTestingModule({
      providers: [KeyboardShortcutService],
    });
  });

  it('should be created', () => {
    const keybdService: KeyboardShortcutService = TestBed.get(KeyboardShortcutService);
    expect(keybdService).toBeTruthy();
  });

  it('getActiveModalStatus should return correct default value', () => {
    expect(keyboardService.getActiveModalStatus()).toBe(false);
  });

  it('getFocusActiveStatus should return correct default value', () => {
    expect(keyboardService.getFocusActiveStatus()).toBe(false);
  });

  it('setActiveModalStatus should modify the value correctly', () => {
    const newActiveValue = true;
    keyboardService.setActiveModalStatus(newActiveValue);
    expect(keyboardService.getActiveModalStatus()).toBe(true);
  });

  it('setFocusActive should modify the value correctly', () => {
    const newActiveValue = true;
    keyboardService.setFocusActive(newActiveValue);
    expect(keyboardService.getFocusActiveStatus()).toBe(true);
  });

  it('validateEntry should return the correct KeyboardShortcutType', () => {
    // Valeurs de string indéfinies
    expect(keyboardService.validateEntry('oihaieruhge', keyboardService.shortcutMap)).toBe(KeyboardShortcutType.None);
    expect(keyboardService.validateEntry('-1', keyboardService.shortcutMap)).toBe(KeyboardShortcutType.None);
    expect(keyboardService.validateEntry('4', keyboardService.shortcutMap)).toBe(KeyboardShortcutType.None);
    expect(keyboardService.validateEntry('aiuerhgiurehg', keyboardService.ctrlShortcutMap)).toBe(KeyboardShortcutType.None);
    expect(keyboardService.validateEntry('4', keyboardService.ctrlShortcutMap)).toBe(KeyboardShortcutType.None);
    expect(keyboardService.validateEntry('eriugheriuhg', keyboardService.ctrlShiftShortcutMap)).toBe(KeyboardShortcutType.None);
    expect(keyboardService.validateEntry('4', keyboardService.ctrlShiftShortcutMap)).toBe(KeyboardShortcutType.None);
    // Valeurs recevables
    expect(keyboardService.validateEntry('c', keyboardService.shortcutMap)).toBe(KeyboardShortcutType.Pencil);
    expect(keyboardService.validateEntry('w', keyboardService.shortcutMap)).toBe(KeyboardShortcutType.PaintBrush);
    expect(keyboardService.validateEntry('o', keyboardService.ctrlShortcutMap)).toBe(KeyboardShortcutType.CreateDrawing);
    expect(keyboardService.validateEntry('c', keyboardService.ctrlShortcutMap)).toBe(KeyboardShortcutType.Copy);
    expect(keyboardService.validateEntry('z', keyboardService.ctrlShiftShortcutMap)).toBe(KeyboardShortcutType.Redo);
  });
});
