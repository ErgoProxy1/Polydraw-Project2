import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { KeyboardShortcutType } from '../utils/constantsAndEnums';

@Injectable({
  providedIn: 'root',
})

export class KeyboardShortcutService {
  modalWindowActive = false;
  inputFocusedActive = false;
  readonly subject: Subject<KeyboardShortcutType>;
  readonly shortcutMap: Map<string, KeyboardShortcutType>;
  readonly ctrlShortcutMap: Map<string, KeyboardShortcutType>;
  readonly ctrlShiftShortcutMap: Map<string, KeyboardShortcutType>;

  constructor() {
    this.subject = new Subject<KeyboardShortcutType>();
    this.shortcutMap = new Map<string, KeyboardShortcutType>([
      ['c', KeyboardShortcutType.Pencil],
      ['w', KeyboardShortcutType.PaintBrush],
      ['p', KeyboardShortcutType.FountainPen],
      ['y', KeyboardShortcutType.Pen],
      ['a', KeyboardShortcutType.SprayPaint],
      ['1', KeyboardShortcutType.Rectangle],
      ['2', KeyboardShortcutType.Ellipse],
      ['3', KeyboardShortcutType.Polygon],
      ['l', KeyboardShortcutType.Line],
      ['t', KeyboardShortcutType.Text],
      ['r', KeyboardShortcutType.ColorApplicator],
      ['b', KeyboardShortcutType.PaintBucket],
      ['e', KeyboardShortcutType.Eraser],
      ['i', KeyboardShortcutType.Dropper],
      ['s', KeyboardShortcutType.Select],
      ['g', KeyboardShortcutType.Grid],
      ['m', KeyboardShortcutType.Magnet],
      ['+', KeyboardShortcutType.ZoomInGrid],
      ['-', KeyboardShortcutType.ZoomOutGrid],
    ]);
    this.ctrlShortcutMap = new Map<string, KeyboardShortcutType>([
      ['o', KeyboardShortcutType.CreateDrawing],
      ['s', KeyboardShortcutType.SaveDrawing],
      ['g', KeyboardShortcutType.OpenGallery],
      ['e', KeyboardShortcutType.ExportDrawing],
      ['x', KeyboardShortcutType.Cut],
      ['c', KeyboardShortcutType.Copy],
      ['v', KeyboardShortcutType.Paste],
      ['d', KeyboardShortcutType.Duplicate],
      ['z', KeyboardShortcutType.Undo],
    ]);
    this.ctrlShiftShortcutMap = new Map<string, KeyboardShortcutType>([
      ['z', KeyboardShortcutType.Redo],
    ]);
  }

  // Valide l'entrée pour gérer les undefined
  validateEntry(entryString: string, entryMap: Map<string, KeyboardShortcutType>) {
    if (entryMap.has(entryString)) {
      return entryMap.get(entryString);
    } else {
      return KeyboardShortcutType.None;
    }
  }

  onKeyPress(keyboard: KeyboardEvent): void {
    this.preventDefaultKeyboardEvent(keyboard);
    let keyboardCommandType: KeyboardShortcutType | undefined = KeyboardShortcutType.None;
    const key = keyboard.key.toLowerCase();

    // si pas de fenêtre modale ou qu'il n'y a pas d'input form
    if (!this.modalWindowActive) {
      // clés avec CTRL enfoncé
      if (keyboard.ctrlKey) {
        // CTRL+SHIFT+z
        if (keyboard.shiftKey) {
          keyboardCommandType = this.validateEntry(key, this.ctrlShiftShortcutMap);
        } else {
          keyboardCommandType = this.validateEntry(key, this.ctrlShortcutMap);
        }
        // clés seules
      } else if (!this.inputFocusedActive) {
        // Delete Key
        if (keyboard.code === '46') {
          keyboardCommandType = KeyboardShortcutType.Delete;
        } else if (keyboard.altKey) {
          keyboard.preventDefault();
          keyboardCommandType = KeyboardShortcutType.ChangeRotationRate;
        }
        keyboardCommandType = this.validateEntry(key, this.shortcutMap);
      }
    }
    this.subject.next(keyboardCommandType);
  }

  // empêcher les clés par défaut du browser (ie. ouvrir un nouveau document HTML, sauvegarder HTML, etc.)
  private preventDefaultKeyboardEvent(keyboard: KeyboardEvent): void {
    const key = keyboard.key.toLowerCase();
    if (keyboard.ctrlKey &&
      (key === 'o'
        || key === 's'
        || key === 'g'
        || key === 'e'
        || (key === 'x' && !this.inputFocusedActive)
        || (key === 'c' && !this.inputFocusedActive)
        || (key === 'v' && !this.inputFocusedActive)
        || key === 'd'
        || (key === 'a' && !this.inputFocusedActive)
        || (key === 'z' && !this.inputFocusedActive))) {
      keyboard.preventDefault();
      keyboard.stopPropagation();
    } else if (keyboard.altKey) {
      keyboard.preventDefault();
    }
  }

  getKeyboardShortcutType(): Observable<KeyboardShortcutType> {
    return this.subject.asObservable();
  }
}
