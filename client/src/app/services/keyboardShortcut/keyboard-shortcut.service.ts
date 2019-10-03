import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { KeyboardShortcutType } from '../utils/constantsAndEnums';

@Injectable({
  providedIn: 'root',
})

export class KeyboardShortcutService {
  private modalWindowActive = false;
  private inputFocusedActive = false;
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

  getActiveModalStatus(): boolean {
    return this.modalWindowActive;
  }

  getFocusActiveStatus(): boolean {
    return this.inputFocusedActive;
  }

  setActiveModalStatus(activeStatus: boolean): void {
    this.modalWindowActive = activeStatus;
  }

  setFocusActive(activeStatus: boolean): void {
    this.inputFocusedActive = activeStatus;
  }

  // Valide l'entrée pour gérer les undefined
  validateEntry(entryString: string, entryMap: Map<string, KeyboardShortcutType>): KeyboardShortcutType {
    if (entryMap.has(entryString)) {
      return  (entryMap.get(entryString)) as KeyboardShortcutType;
    } else {
      return KeyboardShortcutType.None;
    }
  }

  onKeyPress(keyboard: KeyboardEvent): void {
    this.preventDefaultKeyboardEvent(keyboard);
    let keyboardCommandType: KeyboardShortcutType | undefined = KeyboardShortcutType.None;

    // si pas de fenêtre modale ou qu'il n'y a pas d'input form
    if (!this.modalWindowActive) {
      // clés avec CTRL enfoncé
      if (keyboard.ctrlKey) {
        // CTRL+SHIFT+z
        if (keyboard.shiftKey) {
          keyboardCommandType = this.validateEntry(keyboard.key.toLowerCase(), this.ctrlShiftShortcutMap);
        } else {
          keyboardCommandType = this.validateEntry(keyboard.key.toLowerCase(), this.ctrlShortcutMap);
        }
        // clés seules
      } else if (!this.inputFocusedActive) {
        // Delete Key
        // tslint:disable-next-line
        if (keyboard.which === 46) {
          keyboardCommandType = KeyboardShortcutType.Delete;
        }
        keyboardCommandType = this.validateEntry(keyboard.key.toLowerCase(), this.shortcutMap);
      }
    }
    this.subject.next(keyboardCommandType);
  }

  // empêcher les clés par défaut du browser (ie. ouvrir un nouveau document HTML, sauvegarder HTML, etc.)
  private preventDefaultKeyboardEvent(keyboard: KeyboardEvent): void {
    if (keyboard.ctrlKey &&
      (keyboard.key.toLowerCase() === 'o'
        || keyboard.key.toLowerCase() === 's'
        || keyboard.key.toLowerCase() === 'g'
        || keyboard.key.toLowerCase() === 'e'

        || (keyboard.key.toLowerCase() === 'x' && !this.inputFocusedActive)
        || (keyboard.key.toLowerCase() === 'c' && !this.inputFocusedActive)
        || (keyboard.key.toLowerCase() === 'v' && !this.inputFocusedActive)
        || keyboard.key.toLowerCase() === 'd'
        || (keyboard.key.toLowerCase() === 'a' && !this.inputFocusedActive)

        || (keyboard.key.toLowerCase() === 'z' && !this.inputFocusedActive))) {
      keyboard.preventDefault();
      keyboard.stopPropagation();
    }
  }

  getKeyboardShortcutType(): Observable<KeyboardShortcutType> {
    return this.subject.asObservable();
  }
}
