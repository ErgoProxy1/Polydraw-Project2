import { Observable, Subject } from 'rxjs';
import { ClipboardService } from '../clipboard/clipboard.service';
import { Handle } from '../svgPrimitives/ellipse/handle/handle';
import { Perimeter } from '../svgPrimitives/rectangle/perimeter/perimeter';
import { Rectangle } from '../svgPrimitives/rectangle/rectangle';
import { SVGPrimitive } from '../svgPrimitives/svgPrimitive';
import { DeleteCutCommand } from '../toolCommands/deleteCutCommand';
import { DuplicateCommand } from '../toolCommands/duplicateCommand';
import { PasteCommand } from '../toolCommands/pasteCommand';
import { ToolCommand } from '../toolCommands/toolCommand';
import { Tool } from '../tools/tool';
import { Color } from '../utils/color';
import { MouseEventType, POINTER_CURSOR, StrokeType, ToolType } from '../utils/constantsAndEnums';
import { GeometryHelper } from '../utils/geometryHelper';
import { Point } from '../utils/point';

enum SelectionState {
  Selecting,
  Reversing,
  Idle,
  Moving,
}

export class SelectorTool extends Tool {
  type = ToolType.SelectorTool;
  private boundingBox: Rectangle;
  private selectionRectangle: Perimeter;
  private initialPosition: Point;
  private primitivesInSelectionBox: Set<SVGPrimitive> = new Set<SVGPrimitive>();
  private primitives: SVGPrimitive[] = [];
  private selectionState: SelectionState = SelectionState.Idle;
  private selectionBoxInUse = false;
  private commandSubject: Subject<ToolCommand> = new Subject<ToolCommand>();
  private selectionSubject: Subject<boolean> = new Subject<boolean>();

  constructor(private clipboardService: ClipboardService) {
    super();
    this.boundingBox = new Rectangle(Color.WHITE, Color.BLACK, 2, StrokeType.Outline, new Point(0, 0));
  }

  mouseEvent(eventType: MouseEventType, position: Point, primitive?: SVGPrimitive | undefined): void {
    switch (eventType) {
      case MouseEventType.MouseDownLeft:
        if (primitive && !primitive.selectable) { // point de controle
          // TODO: sprint4: ajouter transformations
        } else if (GeometryHelper.isPointInsideRectangle(position, this.boundingBox)) { // dans la boite englobante
          // TODO: sprint4: ajouter deplacement
        } else {
          this.resetSelection();
          this.beginSelectionBox(position);
          this.selectionState = SelectionState.Selecting;
        }
        break;
      case MouseEventType.MouseDownRight:
        this.beginSelectionBox(position);
        this.selectionState = SelectionState.Reversing;
        break;
      case MouseEventType.MouseClickLeft:
      case MouseEventType.MouseClickRight:
        if (!this.selectionBoxInUse) {
          if (primitive && primitive.selectable) {
            if (eventType === MouseEventType.MouseClickLeft) {
              this.selectPrimitive(primitive);
            } else if (eventType === MouseEventType.MouseClickRight) {
              this.reverseSelection(primitive);
            }
          }
        }
        this.selectionState = SelectionState.Idle;
        this.selectionBoxInUse = false;
        this.clipboardService.resetDuplicateOffset();
        break;
      case MouseEventType.MouseMove:
        this.updateSelectionBox(position);
        break;
    }
    this.temporaryPrimitivesAvailable.next();
  }

  subscribeToCommand(): Observable<ToolCommand> {
    return this.commandSubject.asObservable();
  }

  subscribeToSelection(): Observable<boolean> {
    return this.selectionSubject.asObservable();
  }

  getCursor(): string {
    return POINTER_CURSOR;
  }

  standby(): void {
    this.resetSelection();
  }

  setActive(primitives: SVGPrimitive[]): void {
    this.updatePrimitivesList(primitives);
    this.resetSelection();
  }

  resetSelection(): void {
    this.primitives.forEach((primitive) => {
      primitive.selected = false;
    });
    this.updateBoundingBox();
  }

  updatePrimitivesList(primitives: SVGPrimitive[]): void {
    this.primitives = primitives;
    this.updateBoundingBox();
  }

  getPrimitivesList(): SVGPrimitive[] {
    return this.primitives;
  }

  getTemporaryPrimitives(): SVGPrimitive[] {
    let temp: SVGPrimitive[] = [];
    if (this.primitives.filter((primitive) => primitive.selected).length > 0) {
      this.updateBoundingBox();
      temp.push(this.boundingBox);
      temp = temp.concat(this.getHandles());
    }
    if (this.selectionState !== SelectionState.Idle) {
      temp.push(this.selectionRectangle);
    }
    return temp;
  }

  private selectPrimitive(primitive: SVGPrimitive): void {
    if (primitive.selectable) {
      this.resetSelection();
      this.addPrimitiveToSelected(primitive);
    }
  }

  private reverseSelection(primitive: SVGPrimitive): void {
    if (primitive.selectable) {
      primitive.selected ? this.removePrimitiveFromSelected(primitive) : this.addPrimitiveToSelected(primitive);
    }
  }

  private addPrimitiveToSelected(primitive: SVGPrimitive): void {
    if (primitive.selectable) {
      primitive.selected = true;
      this.updateBoundingBox();
    }
  }

  private removePrimitiveFromSelected(primitive: SVGPrimitive): void {
    if (primitive.selectable) {
      primitive.selected = false;
      this.updateBoundingBox();
    }
  }

  private beginSelectionBox(position: Point): void {
    this.initialPosition = position;
    this.selectionRectangle = new Perimeter(position);
    this.primitivesInSelectionBox = new Set();
  }

  private updateSelectionBox(position: Point): void {
    if (this.selectionState !== SelectionState.Idle && this.selectionRectangle) {
      this.selectionBoxInUse = true;
      this.selectionRectangle.resize(this.initialPosition, position);
      this.primitives.forEach((i) => {
        if (GeometryHelper.isPrimitiveIntersectingRectangle(i, this.selectionRectangle)) {
          this.addPrimitiveToSelectionBox(i);
        } else {
          this.removePrimitiveFromSelectionBox(i);
        }
      });
    }
  }

  private addPrimitiveToSelectionBox(primitive: SVGPrimitive): void {
    if (!this.primitivesInSelectionBox.has(primitive)) {
      this.primitivesInSelectionBox.add(primitive);
      if (this.selectionState === SelectionState.Selecting) {
        this.addPrimitiveToSelected(primitive);
      } else if (this.selectionState === SelectionState.Reversing) {
        this.reverseSelection(primitive);
      }
    }
  }

  private removePrimitiveFromSelectionBox(primitive: SVGPrimitive): void {
    if (this.primitivesInSelectionBox.has(primitive)) {
      this.primitivesInSelectionBox.delete(primitive);
      if (this.selectionState === SelectionState.Selecting) {
        this.removePrimitiveFromSelected(primitive);
      } else if (this.selectionState === SelectionState.Reversing) {
        this.reverseSelection(primitive);
      }
    }
  }

  private updateBoundingBox(): void {
    const boundingBoxTopLeft: Point = new Point(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);
    const boundingBoxBottomRight: Point = new Point(Number.MIN_SAFE_INTEGER, Number.MIN_SAFE_INTEGER);
    const selectedPrimitives: SVGPrimitive[] = this.primitives.filter((primitive) => primitive.selected);
    if (selectedPrimitives.length > 0) {
      selectedPrimitives.forEach((primitive) => {
        const topLeft: Point = primitive.getTopLeftCorner();
        const bottomRight: Point = primitive.getBottomRightCorner();
        boundingBoxTopLeft.x = Math.min(boundingBoxTopLeft.x, topLeft.x);
        boundingBoxTopLeft.y = Math.min(boundingBoxTopLeft.y, topLeft.y);
        boundingBoxBottomRight.x = Math.max(boundingBoxBottomRight.x, bottomRight.x);
        boundingBoxBottomRight.y = Math.max(boundingBoxBottomRight.y, bottomRight.y);
      });
      this.boundingBox.resize(boundingBoxTopLeft, boundingBoxBottomRight, false);
    } else {
      this.boundingBox.resize(new Point(0, 0), new Point(0, 0), false);
    }
    this.selectionSubject.next(this.primitives.filter((primitive) => primitive.selected).length > 0);
  }

  private getHandles(): SVGPrimitive[] {
    const handlePositions: Point[] = [
      this.boundingBox.corner1,
      this.boundingBox.corner2,
      new Point(this.boundingBox.corner1.x, this.boundingBox.corner2.y),
      new Point(this.boundingBox.corner2.x, this.boundingBox.corner1.y),
      new Point(this.boundingBox.center.x, this.boundingBox.corner1.y),
      new Point(this.boundingBox.center.x, this.boundingBox.corner2.y),
      new Point(this.boundingBox.corner1.x, this.boundingBox.center.y),
      new Point(this.boundingBox.corner2.x, this.boundingBox.center.y),
    ];

    const handles: SVGPrimitive[] = [];

    handlePositions.forEach((point) => {
      handles.push(new Handle(point));
    });

    return handles;
  }

  getPrimitivesToDraw(): SVGPrimitive[] {
    let temp: SVGPrimitive[] = [];
    if (this.primitives.filter((primitive) => primitive.selected).length > 0) {
      this.updateBoundingBox();
      temp.push(this.boundingBox);
      temp = temp.concat(this.getHandles());
    }
    if (this.selectionState !== SelectionState.Idle) {
      temp.push(this.selectionRectangle);
    }
    return temp;
  }

  private getPrimitivesSelected(): SVGPrimitive[] {
    const buffer: SVGPrimitive[] = [];
    this.primitives.forEach((primitive) => {
      if (primitive.selected) {
        buffer.push(primitive);
      }
    });
    return buffer;
  }

  private resetClipboard(): void {
    this.clipboardService.primitives.length = 0;
    this.clipboardService.resetPasteOffest();
  }

  copy(): void {
    this.resetClipboard();
    this.clipboardService.primitives = this.getPrimitivesSelected();
  }

  cut(): void {
    this.resetClipboard();
    this.clipboardService.primitives = this.getPrimitivesSelected();
    const command: ToolCommand = new DeleteCutCommand(this.clipboardService.primitives, this.primitives);
    this.commandSubject.next(command);
  }

  paste(): void {
    if (this.clipboardService.primitives.length > 0) {
      const command: ToolCommand = new PasteCommand(this.clipboardService);
      this.commandSubject.next(command);
    }
  }

  duplicate(): void {
    const command: ToolCommand = new DuplicateCommand(this.getPrimitivesSelected(), this.clipboardService);
    this.commandSubject.next(command);
  }

  delete(): void {
    const svgToDelete: SVGPrimitive[] = this.getPrimitivesSelected();
    const command: ToolCommand = new DeleteCutCommand(svgToDelete, this.primitives);
    this.commandSubject.next(command);
  }

  takeAll(): void {
    if (this.primitives.length > 0) {
      this.primitives.forEach((primitive) => {
        this.addPrimitiveToSelected(primitive);
      });
    }
    this.updateBoundingBox();
    this.temporaryPrimitivesAvailable.next();
  }

  isClipboardEmpty(): boolean {
    return this.clipboardService.primitives.length === 0;
  }
}
