import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { KeyboardService } from 'src/app/services/keyboard/keyboard.service';
import { RotationService } from 'src/app/services/rotation/rotation.service';
import { SelectorTool } from 'src/app/services/tools/selectorTool';
import { ToolsService } from 'src/app/services/tools/tools.service';
import { Color } from 'src/app/services/utils/color';
import { GridAlignment, KeyboardShortcutType,
  MAX_ROTATION_ANGLE, MIN_ROTATION_ANGLE, ToolType } from 'src/app/services/utils/constantsAndEnums';

@Component({
  selector: 'app-selection-properties',
  templateUrl: './selection-properties.component.html',
  styleUrls: ['./selection-properties.component.scss'],
})
export class SelectionPropertiesComponent implements OnInit, OnDestroy {
  readonly MAX_ANGLE = MAX_ROTATION_ANGLE;
  readonly MIN_ANGLE = MIN_ROTATION_ANGLE;

  private selectedToolSubscription: Subscription;
  strokeWidth: number;
  selector: SelectorTool;
  isPrimitiveSelected = false;
  private gridAlignment: GridAlignment = GridAlignment.None;
  private selectionSubscription: Subscription = new Subscription();
  private keyboardSubscription: Subscription = new Subscription();
  readonly GRID_ALIGNMENT_NAMES_MAP: Map<string, GridAlignment> = new Map([
    ['Aucun', GridAlignment.None],
    ['Supérieur gauche', GridAlignment.TopLeft],
    ['Centre gauche', GridAlignment.CenterLeft],
    ['Inférieur gauche', GridAlignment.BottomLeft],
    ['Inférieur centre', GridAlignment.BottomCenter],
    ['Inférieur droit', GridAlignment.BottomRight],
    ['Centre droit', GridAlignment.CenterRight],
    ['Supérieur droit', GridAlignment.TopRight],
    ['Supérieur centre', GridAlignment.TopCenter],
    ['Centre', GridAlignment.Center],
  ]);
  rotationAngle = 0;
  private rotationAngleSubscription: Subscription = new Subscription();

  readonly UNSELECTED_COLOR: Color = new Color(200, 200, 200, 1);
  readonly SELECTED_COLOR: Color = new Color(255, 64, 0, 1);

  constructor(private toolsService: ToolsService, private keyboardService: KeyboardService, private rotationService: RotationService) {
  }

  ngOnInit(): void {
    this.selectedToolSubscription = this.toolsService.subscribeToToolChanged().subscribe((toolSelected) => {
      this.selector = toolSelected as SelectorTool;
      if (this.selector) {
        this.selectionSubscription = this.selector.subscribeToSelection().subscribe((primitiveSelected) => {
          this.isPrimitiveSelected = primitiveSelected;
        });
        this.gridAlignment = this.selector.gridAlignment;
      }
      this.rotationAngleSubscription = this.selector.rotationAngleObservable.subscribe((rotationAngle) => {
        this.applyRotation(rotationAngle);
      });
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
    this.rotationAngleSubscription.unsubscribe();
  }

  getAlignmentColor(gridAlignment: GridAlignment): string {
    return gridAlignment === this.gridAlignment ? this.SELECTED_COLOR.asString() : this.UNSELECTED_COLOR.asString();
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

  // Pour changer l'allignement a partir de la barre de selection
  onChangeGridAlignment(): void {
    if (this.gridAlignment in GridAlignment) {
      this.selector.gridAlignment = this.gridAlignment;
    } else {
      this.gridAlignment = this.selector.gridAlignment;
    }
  }

  // Pour changer l'allignement a partir de l'image
  changeGridAlignmentFromDrawing(index: number): void {
    this.gridAlignment = index;
    this.selector.gridAlignment = this.gridAlignment;
  }

  onChangeRotation(): void {
    if (this.rotationAngle > this.MAX_ANGLE) {
      this.rotationAngle = this.MAX_ANGLE;
    } else if (this.rotationAngle < this.MIN_ANGLE) {
      this.rotationAngle = this.MIN_ANGLE;
    }
    this.rotationService.setNewAngle(this.rotationAngle);
    this.selector.applyRotationFromProperties(this.rotationAngle);
  }

  private applyRotation(angle: number) {
    if (angle < this.MIN_ANGLE) { angle += 360; }
    if (angle > this.MAX_ANGLE) { angle = this.MIN_ANGLE; }
    this.rotationAngle = angle;
  }
}
