import { Injectable } from '@angular/core';
import { DrawingService } from '../drawing/drawing.service';
import { SVGPrimitive } from '../svgPrimitives/svgPrimitive';
import { ORIGIN, PASTE_OFFSET as CLIPBOARD_OFFSET } from '../utils/constantsAndEnums';
import { NewDrawingInfo } from '../utils/newDrawingInfo';
import { Point } from '../utils/point';

@Injectable({
  providedIn: 'root',
})

export class ClipboardService {
  private primitives: SVGPrimitive[] = [];
  private pasteOffset: Point = ORIGIN;
  private duplicateOffset: Point = ORIGIN;
  private canvasHeight: number;
  private canvasWidth: number;

  constructor(private drawingService: DrawingService) {
    this.drawingService.initWorkspaceObservable.subscribe((data: number[]) => {
      if (data.length === 2) {
        this.canvasWidth = data[0];
        this.canvasHeight = data[1];
      }
    });

    this.drawingService.drawingObservable.subscribe((data: NewDrawingInfo) => {
      this.canvasHeight = data.height;
      this.canvasWidth = data.width;
    });
  }

  decrementPasteOffset(): void {
    this.pasteOffset = this.getDecrementedOffset(this.pasteOffset);
  }

  incrementPasteOffset(): void {
    this.pasteOffset = this.getInccrementedOffset(this.pasteOffset, this.primitives);
  }

  getPasteOffset(): Point {
    return this.pasteOffset;
  }

  resetPasteOffest(): void {
    this.pasteOffset = ORIGIN;
  }

  decrementDuplicateOffset(): void {
    this.duplicateOffset = this.getDecrementedOffset(this.duplicateOffset);
  }

  incrementDuplicateOffset(duplicatedPrimitives: SVGPrimitive[]): void {
    this.duplicateOffset = this.getInccrementedOffset(this.duplicateOffset, duplicatedPrimitives);
  }

  getDuplicateOffset(): Point {
    return this.duplicateOffset;
  }

  resetDuplicateOffset(): void {
    this.duplicateOffset = ORIGIN;
  }

  getPrimitives(): SVGPrimitive[] {
    return this.primitives;
  }

  setPrimitives(primitives: SVGPrimitive[]): void {
    this.primitives = [];
    primitives.forEach((primitive: SVGPrimitive) => {
      this.primitives.push(primitive.copy());
    });
  }

  resetPrimitives(): void {
    this.primitives.length = 0;
  }

  private getDecrementedOffset(offset: Point): Point {
    offset = Point.substractPoints(offset, CLIPBOARD_OFFSET);
    if (offset.x < 0 || offset.y < 0) {
      offset = ORIGIN;
    }
    return offset;
  }

  private getInccrementedOffset(offset: Point, primitives: SVGPrimitive[]): Point {
    offset = Point.sumPoints(offset, CLIPBOARD_OFFSET);
    let topLeftCorner: Point = new Point(Infinity, Infinity);
    primitives.forEach((primitive: SVGPrimitive) => {
      const primitiveTopLeft: Point = primitive.getTopLeftCorner();
      topLeftCorner = new Point(Math.min(primitiveTopLeft.x, topLeftCorner.x),
                                    Math.min(primitiveTopLeft.y, topLeftCorner.y));
    });
    const newTopLeftCorner: Point = Point.sumPoints(topLeftCorner, offset);
    if (newTopLeftCorner.x >= this.canvasWidth || newTopLeftCorner.y >= this.canvasHeight) {
      offset = ORIGIN;
    }
    return offset;
  }
}
