import { OnDestroy } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { BoundingBoxService } from '../boundingBoxService/bounding-box.service';
import { ClipboardService } from '../clipboard/clipboard.service';
import { MoveService } from '../move/move.service';
import { ResizeService } from '../resize/resize.service';
import { RotationService } from '../rotation/rotation.service';
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
// tslint:disable-next-line: max-line-length
import { BOTTOM_HANDLE_CURSOR, BOTTOM_LEFT_HANDLE_CURSOR, BOTTOM_RIGHT_HANDLE_CURSOR, GRAB_CURSOR, GridAlignment, HandleType, KeyboardEventType, LEFT_HANDLE_CURSOR, MouseEventType, POINTER_CURSOR, RIGHT_HANDLE_CURSOR, StrokeType, ToolType, TOP_HANDLE_CURSOR, TOP_LEFT_HANDLE_CURSOR, TOP_RIGHT_HANDLE_CURSOR } from '../utils/constantsAndEnums';
import { GeometryHelper } from '../utils/geometryHelper';
import { Point } from '../utils/point';
import { Grid } from './grid';

enum SelectionState {
  Selecting,
  Reversing,
  Idle,
  Moving,
  Resizing,
  Rotating,
}

export class SelectorTool extends Tool implements OnDestroy {
  TYPE = ToolType.SelectorTool;
  private boundingBox: Rectangle;
  private selectionRectangle: Perimeter;
  private initialPosition: Point;
  private primitivesInSelectionBox: Set<SVGPrimitive> = new Set<SVGPrimitive>();
  private primitives: SVGPrimitive[] = [];
  private selectionState: SelectionState = SelectionState.Idle;
  private selectionBoxInUse = false;
  private commandSubject: Subject<ToolCommand> = new Subject<ToolCommand>();
  private selectionSubject: Subject<boolean> = new Subject<boolean>();

  private rotationAngleSubject: Subject<number> = new Subject<number>();
  rotationAngleObservable: Observable<number> = this.rotationAngleSubject.asObservable();
  private angle: number;
  newSelection = false;
  lastSelectionLength = 0;

  private initialMovePosition: Point;
  private lastMovePosition: Point;
  private handleType: HandleType = HandleType.None;
  private keepAspectRatio = false;
  private isSymetrical = false;
  private gridSubscription: Subscription;
  private gridSquareSize: number;
  gridAlignment: GridAlignment = GridAlignment.None;

  ngOnDestroy(): void {
    this.gridSubscription.unsubscribe();
  }

  constructor(private clipboardService: ClipboardService, private boundingBoxService: BoundingBoxService,
              private resizeService: ResizeService, private moveService: MoveService, private rotationService: RotationService,
              currentGridSquareSize: number, gridObservable: Observable<Grid>) {
    super();
    this.boundingBox = new Rectangle(Color.WHITE, Color.BLACK, 2, StrokeType.Outline, new Point(0, 0));
    this.rotationAngleObservable = this.rotationAngleSubject.asObservable();
    this.boundingBox.SELECTABLE = false;
    this.gridSquareSize = currentGridSquareSize;
    this.gridSubscription = gridObservable.subscribe((grid: Grid) => {
      this.gridSquareSize = grid.sizeOfSquare();
    });
  }

  mouseEvent(eventType: MouseEventType, position: Point, primitive?: SVGPrimitive | undefined): void {
    this.updateBoundingBox();
    switch (eventType) {
      case MouseEventType.MouseDownLeft:
        this.beginLeft(position, primitive);
        break;
      case MouseEventType.MouseDownRight:
        this.beginRight(position);
        break;
      case MouseEventType.MouseUpLeft:
      case MouseEventType.MouseUpRight:
      case MouseEventType.MouseLeave:
        this.end(eventType === MouseEventType.MouseLeave, primitive);
        break;
      case MouseEventType.MouseMove:
        this.update(position);
        break;
    }
    this.isNewSelection();
    this.temporaryPrimitivesAvailable.next();
  }

  private beginLeft(position: Point, primitive?: SVGPrimitive): void {
    if (primitive && !primitive.SELECTABLE) { // point de controle
      const handle: Handle = primitive as Handle;
      if (handle) {
        this.handleType = handle.handleType;
        this.beginResize(position);
      }
    } else if (GeometryHelper.isPointInsideRectangle(position, this.boundingBox)) { // dans la boite englobante
      this.beginMove(position);
    } else {
      this.resetSelection();
      this.beginSelectionBox(position, false);
    }
  }

  private beginRight(position: Point): void {
    this.beginSelectionBox(position, true);
  }

  private update(position: Point): void {
    if (this.selectionState === SelectionState.Moving) {
      this.updateMove(position);
    } else if (this.selectionState === SelectionState.Resizing) {
      this.updateResize(position);
    } else if (this.selectionState === SelectionState.Selecting || this.selectionState === SelectionState.Reversing) {
      this.updateSelectionBox(position);
    }
  }

  private end(mouseLeave: boolean, primitive?: SVGPrimitive): void {
    if (!mouseLeave) {
      this.clipboardService.resetDuplicateOffset();
      if (!this.selectionBoxInUse && primitive && primitive.SELECTABLE) {
        if (this.selectionState === SelectionState.Selecting) {
          this.selectPrimitive(primitive);
        } else if (this.selectionState === SelectionState.Reversing) {
          this.reverseSelection(primitive);
        }
      }
    }
    if (this.selectionState === SelectionState.Moving) {
      this.endMove();
    } else if (this.selectionState === SelectionState.Resizing) {
      this.endResize();
    }
    this.selectionState = SelectionState.Idle;
    this.selectionBoxInUse = false;
  }

  keyboardEvent(eventType: KeyboardEventType): void {
    switch (eventType) {
      case KeyboardEventType.ShiftDown:
        this.keepAspectRatio = true;
        if (this.selectionState === SelectionState.Rotating) {
          this.endRotation();
        }
        break;
      case KeyboardEventType.ShiftUp:
        this.keepAspectRatio = false;
        if (this.selectionState === SelectionState.Rotating) {
          this.endRotation();
        }
        break;
      case KeyboardEventType.AltDown:
        this.isSymetrical = true;
        break;
      case KeyboardEventType.AltUp:
        this.isSymetrical = false;
        break;
      default:
        break;
    }
    this.rotationService.keyboardEvent(eventType);
  }

  subscribeToCommand(): Observable<ToolCommand> {
    return this.commandSubject.asObservable();
  }

  subscribeToSelection(): Observable<boolean> {
    return this.selectionSubject.asObservable();
  }

  mouseWheelEvent(delta: number): void {
    if (this.selectionState !== SelectionState.Rotating) {
      this.selectionState = SelectionState.Rotating;
      this.rotationService.beginRotation(this.getPrimitivesSelected(), this.boundingBox.getCenter(), this.newSelection);
      this.newSelection = false;
    } else {
      this.rotationService.updateRotation(delta);
      this.angle = this.rotationService.getAngle();
      this.rotationAngleSubject.next(this.angle);
    }
    this.temporaryPrimitivesAvailable.next();
  }

  getCursor(): string {
    if (this.selectionState === SelectionState.Resizing) {
      switch (this.handleType) {
        case HandleType.TopLeft:
          return TOP_LEFT_HANDLE_CURSOR;
        case HandleType.Top:
          return TOP_HANDLE_CURSOR;
        case HandleType.TopRight:
          return TOP_RIGHT_HANDLE_CURSOR;
        case HandleType.Left:
          return LEFT_HANDLE_CURSOR;
        case HandleType.Right:
          return RIGHT_HANDLE_CURSOR;
        case HandleType.BottomLeft:
          return BOTTOM_LEFT_HANDLE_CURSOR;
        case HandleType.Bottom:
          return BOTTOM_HANDLE_CURSOR;
        case HandleType.BottomRight:
          return BOTTOM_RIGHT_HANDLE_CURSOR;
      }
    } else if (this.selectionState === SelectionState.Moving) {
      return GRAB_CURSOR;
    }
    return POINTER_CURSOR;
  }

  standby(): void {
    this.resetSelection();
    if (this.selectionState === SelectionState.Rotating) {
      this.endRotation();
    }
  }

  setActive(primitives: SVGPrimitive[]): void {
    this.updatePrimitivesList(primitives);
    this.resetSelection();
  }

  resetSelection(): void {
    this.primitives.forEach((primitive) => {
      primitive.selected = false;
    });
  }

  updatePrimitivesList(primitives: SVGPrimitive[]): void {
    this.primitives = primitives;
  }

  getPrimitivesList(): SVGPrimitive[] {
    return this.primitives;
  }

  getTemporaryPrimitives(): SVGPrimitive[] {
    this.updateBoundingBox();
    let temp: SVGPrimitive[] = [];
    if (this.getPrimitivesSelected().length > 0) {
      if (this.selectionState === SelectionState.Moving) {
        temp = this.moveService.getTemporaryPrimitives();
        this.boundingBox.move(this.getTranslation(this.lastMovePosition, this.initialMovePosition, true));
      } else if (this.selectionState === SelectionState.Resizing) {
        temp = this.resizeService.getTemporaryPrimitives();
        this.resizeService.calculateNewScaleFactors(this.getTranslation(this.lastMovePosition, this.initialMovePosition, false),
          this.handleType, this.keepAspectRatio, this.isSymetrical);
        this.boundingBox.scale(this.resizeService.getRelativeTranslation(this.boundingBox),
          this.resizeService.getScaleFactorX(), this.resizeService.getScaleFactorY(), true);
      }
      temp.push(this.boundingBox);
      temp = temp.concat(this.boundingBox.getHandles());
    }
    if (this.selectionState === SelectionState.Selecting || this.selectionState === SelectionState.Reversing) {
      temp.push(this.selectionRectangle);
    }
    return temp;
  }

  private selectPrimitive(primitive: SVGPrimitive): void {
    if (primitive.SELECTABLE) {
      this.resetSelection();
      this.addPrimitiveToSelected(primitive);
    }
  }

  private reverseSelection(primitive: SVGPrimitive): void {
    if (primitive.SELECTABLE) {
      primitive.selected ? this.removePrimitiveFromSelected(primitive) : this.addPrimitiveToSelected(primitive);
    }
  }

  private addPrimitiveToSelected(primitive: SVGPrimitive): void {
    if (primitive.SELECTABLE) {
      primitive.selected = true;
    }
    this.newSelection = true;
  }

  private removePrimitiveFromSelected(primitive: SVGPrimitive): void {
    if (primitive.SELECTABLE) {
      primitive.selected = false;
    }
    this.newSelection = true;
  }

  private beginSelectionBox(position: Point, reverse: boolean): void {
    if (this.selectionState === SelectionState.Idle) {
      this.initialPosition = position;
      this.selectionRectangle = new Perimeter(position);
      this.primitivesInSelectionBox = new Set();
      this.selectionState = reverse ? SelectionState.Reversing : SelectionState.Selecting;
    }
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
    const selectedPrimitives: SVGPrimitive[] = this.getPrimitivesSelected();
    this.boundingBoxService.resizeBoundingBox(this.boundingBox, selectedPrimitives);
    this.selectionSubject.next(selectedPrimitives.length > 0);
  }

  private getPrimitivesSelected(): SVGPrimitive[] {
    return this.primitives.filter((primitive) => primitive.selected && primitive.SELECTABLE);
  }

  private resetClipboard(): void {
    this.clipboardService.resetPrimitives();
    this.clipboardService.resetPasteOffest();
  }

  copy(): void {
    this.resetClipboard();
    this.clipboardService.setPrimitives(this.getPrimitivesSelected());
  }

  cut(): void {
    this.resetClipboard();
    this.clipboardService.setPrimitives(this.getPrimitivesSelected());
    const command: ToolCommand = new DeleteCutCommand(this.clipboardService.getPrimitives(), this.primitives);
    this.commandSubject.next(command);
  }

  paste(): void {
    if (this.clipboardService.getPrimitives().length > 0) {
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
    this.temporaryPrimitivesAvailable.next();
  }

  isClipboardEmpty(): boolean {
    return this.clipboardService.getPrimitives().length === 0;
  }

  private beginResize(position: Point): void {
    if (this.selectionState === SelectionState.Idle) {
      this.initialMovePosition = this.lastMovePosition = position;
      this.resizeService.beginResize(this.boundingBox, this.getPrimitivesSelected(), this.handleType);
      this.selectionState = SelectionState.Resizing;
    }
  }

  private updateResize(position: Point): void {
    const translation = this.getTranslation(position, this.lastMovePosition, false);
    this.resizeService.updateResize(this.getPrimitivesSelected(), translation, this.keepAspectRatio, this.isSymetrical);
    this.lastMovePosition = position;
  }

  private endResize(): void {
    const primitivesSelected: SVGPrimitive[] = this.getPrimitivesSelected();
    const translation = this.getTranslation(this.lastMovePosition, this.initialMovePosition, true);
    this.commandSubject.next(this.resizeService.endResize(primitivesSelected, translation, this.keepAspectRatio, this.isSymetrical));
  }

  private beginMove(position: Point): void {
    if (this.selectionState === SelectionState.Idle) {
      this.initialMovePosition = this.lastMovePosition = position;
      this.moveService.beginMove(this.getPrimitivesSelected());
      this.selectionState = SelectionState.Moving;
    }
  }

  private updateMove(position: Point): void {
    const translation = this.getTranslation(position, this.lastMovePosition, false);
    this.moveService.updateMove(translation);
    this.lastMovePosition = position;
  }

  private endMove(): void {
    const primitivesSelected: SVGPrimitive[] = this.getPrimitivesSelected();
    const translation = this.getTranslation(this.lastMovePosition, this.initialMovePosition, true);
    this.commandSubject.next(this.moveService.endMove(primitivesSelected, translation));
  }

  private getTranslation(newPoint: Point, originalPoint: Point, magnetism: boolean): Point {
    let translation: Point = Point.substractPoints(newPoint, originalPoint);
    if (magnetism && this.gridAlignment !== GridAlignment.None) {
      this.updateBoundingBox();
      const bBoxOldPoint: Point = this.boundingBox.getAlignmentPosition(this.gridAlignment);
      const newBBoxNewPoint = Point.sumPoints(bBoxOldPoint, translation);
      newBBoxNewPoint.roundToNearestMultipleOf(this.gridSquareSize);
      translation = Point.substractPoints(newBBoxNewPoint, bBoxOldPoint);
    }
    return translation;
  }

  endRotation(): void {
    if (this.selectionState === SelectionState.Rotating) {
      this.selectionState = SelectionState.Idle;
      this.rotationService.beginRotation(this.getPrimitivesSelected(), this.boundingBox.center,
        false);
      this.rotationService.endRotation(this.getPrimitivesSelected());
      if (this.rotationService.getAngle() !== 0) {
        this.commandSubject.next(this.rotationService.command);
      }
    }
  }
  private isNewSelection() {
    if (this.getPrimitivesSelected().length === 0) {
      this.newSelection = false;
    }
  }
  applyRotationFromProperties(angle: number): void {
    this.angle = angle;
    this.selectionState = SelectionState.Rotating;
    this.rotationService.beginRotation(this.getPrimitivesSelected(), this.boundingBox.center,
      this.newSelection);
    this.rotationService.updateRotationFromProperties(angle);
  }
}
