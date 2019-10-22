import { Handle } from '../svgPrimitives/ellipse/handle/handle';
import { Perimeter } from '../svgPrimitives/rectangle/perimeter/perimeter';
import { Rectangle } from '../svgPrimitives/rectangle/rectangle';
import { SVGPrimitive } from '../svgPrimitives/svgPrimitive';
import { Color } from '../utils/color';
import { KeyboardEventType, MouseEventType, StrokeType, ToolType } from '../utils/constantsAndEnums';
import { GeometryHelper } from '../utils/geometryHelper';
import { Point } from '../utils/point';
import { Tool } from './tool';

enum SelectionState {
  Selecting,
  Reversing,
  Idle,
  Moving,
}
export class SelectorTool implements Tool {
  type = ToolType.SelectorTool;
  private boundingBox: Rectangle;
  private selectionRectangle: Perimeter;
  private initialPosition: Point;
  private primitivesInSelectionBox: Set<SVGPrimitive>;
  private primitives: SVGPrimitive[] = [];
  private selectionState: SelectionState = SelectionState.Idle;
  private selectionBoxInUse = false;

  constructor() {
    this.boundingBox = new Rectangle(Color.WHITE, Color.BLACK, 2, StrokeType.Outline, new Point(0, 0));
  }

  mouseEvent(eventType: MouseEventType, position: Point, primitive?: SVGPrimitive | undefined): SVGPrimitive[] {
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
        break;
      case MouseEventType.MouseMove:
        this.updateSelectionBox(position);
        break;
    }
    return this.getPrimitivesToDraw();
  }

  keyboardEvent(eventType: KeyboardEventType, key: string): SVGPrimitive[] {
    return this.getPrimitivesToDraw();
  }

  mouseWheelEvent(delta: number): SVGPrimitive[] {
    return this.getPrimitivesToDraw();
  }

  isCommandReady(): boolean {
    return false;
  }

  getCommand(): null {
    return null;
  }

  resetSelection(): void {
    this.primitives.forEach((primitive) => {
      primitive.selected = false;
    });
    this.updateBoundingBox();
  }

  updatePrimitivesList(primitives: SVGPrimitive[]): void {
    this.resetSelection();
    this.primitives = primitives;
  }

  getPrimitivesList(): SVGPrimitive[] {
    return this.primitives;
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

  private getPrimitivesToDraw(): SVGPrimitive[] {
    let temp: SVGPrimitive[] = [];
    if (this.primitives.filter((primitive) => primitive.selected).length > 0) {
      temp.push(this.boundingBox);
      temp = temp.concat(this.getHandles());
    }
    if (this.selectionState !== SelectionState.Idle) {
      temp.push(this.selectionRectangle);
    }
    return temp;
  }
}
