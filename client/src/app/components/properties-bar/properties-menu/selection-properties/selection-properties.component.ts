import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { KeyboardService } from 'src/app/services/keyboard/keyboard.service';
import { SelectorTool } from 'src/app/services/tools/selectorTool';
import { ToolsService } from 'src/app/services/tools/tools.service';
import { KeyboardShortcutType, ToolType } from 'src/app/services/utils/constantsAndEnums';

@Component({
  selector: 'app-selection-properties',
  templateUrl: './selection-properties.component.html',
  styleUrls: ['./selection-properties.component.scss'],
})
export class SelectionPropertiesComponent implements OnInit, OnDestroy {
  private selectedToolSubscription: Subscription;
  strokeWidth: number;
  selector: SelectorTool;
  isPrimitiveSelected = false;
  private selectionSubscription: Subscription = new Subscription();
  private keyboardSubscription: Subscription = new Subscription();

  constructor(private toolsService: ToolsService, private keyboardService: KeyboardService) {
  }

  ngOnInit(): void {
    this.selectedToolSubscription = this.toolsService.subscribeToToolChanged().subscribe((toolSelected) => {
      this.selector = toolSelected as SelectorTool;
      if (this.selector) {
        this.selectionSubscription = this.selector.subscribeToSelection().subscribe((primitiveSelected) => {
            this.isPrimitiveSelected = primitiveSelected;
        });
      }
    });

    this.keyboardSubscription = this.keyboardService.getKeyboardShortcutType().subscribe(
      (keyboardShortcutType: KeyboardShortcutType) => {
        switch (keyboardShortcutType) {
          case KeyboardShortcutType.Copy:
            this.copy();
            break;
          case KeyboardShortcutType.Paste:
            this.paste();
            break;
          case KeyboardShortcutType.Cut:
            this.cut();
            break;
          case KeyboardShortcutType.Delete:
            this.delete();
            break;
          case KeyboardShortcutType.Duplicate:
            this.duplicate();
            break;
          case KeyboardShortcutType.SelectAll:
            this.takeAll();
            break;
          default:
            break;
        }
      });

    this.toolsService.newToolSelected(ToolType.SelectorTool);
  }

  ngOnDestroy(): void {
    this.selectedToolSubscription.unsubscribe();
    this.keyboardSubscription.unsubscribe();
    if (this.selectionSubscription) {
      this.selectionSubscription.unsubscribe();
    }
  }

  // met le state a copy, prend le contenu svg et lenvoie au clipboardTool
  copy(): void {
    if (this.selector) {
      this.selector.copy();
    }
  }

  // met le state a cut
  cut(): void {
    if (this.selector) {
      this.selector.cut();
    }
  }

  // met le state a paste
  paste(): void {
    if (this.selector) {
      this.selector.paste();
    }
  }

  // met le state a delete
  delete(): void {
    if (this.selector) {
      this.selector.delete();
    }
  }

  // lance la commande dupliquer
  duplicate(): void {
    if (this.selector) {
      this.selector.duplicate();
    }
  }

  // met le state a takeAll
  takeAll(): void {
    if (this.selector) {
      this.selector.takeAll();
    }
  }

  isClipboardEmpty(): boolean {
    if (this.selector) {
      return this.selector.isClipboardEmpty();
    }
    return true;
  }
}
