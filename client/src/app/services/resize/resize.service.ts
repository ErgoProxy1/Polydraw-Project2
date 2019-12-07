import { Injectable } from '@angular/core';
import { Rectangle } from '../svgPrimitives/rectangle/rectangle';
import { SVGPrimitive } from '../svgPrimitives/svgPrimitive';
import { ResizeCommand } from '../toolCommands/resizeCommand';
import { Color } from '../utils/color';
import { HandleType, StrokeType } from '../utils/constantsAndEnums';
import { Point } from '../utils/point';

@Injectable({
  providedIn: 'root',
})

export class ResizeService {
  private resizeSelection: SVGPrimitive[];
  private initialBoundingBox: Rectangle;
  private handleType: HandleType;
  private scaleFactorX = 1;
  private scaleFactorY = 1;
  private translation = new Point(0, 0);
  private isSymetrical = false;

  constructor() {
    this.initialBoundingBox = new Rectangle(Color.WHITE, Color.BLACK, 2, StrokeType.Outline, new Point(0, 0));
    this.resizeSelection = [];
  }

  getTemporaryPrimitives(): SVGPrimitive[] {
    return this.resizeSelection;
  }

  beginResize(initialBoundingBox: Rectangle, primitives: SVGPrimitive[], handleType: HandleType): void {
    this.resetResizeValues();
    this.resizeSelection = [];
    this.initialBoundingBox = initialBoundingBox;
    this.handleType = handleType;
    primitives.forEach((primitive: SVGPrimitive) => {
      this.resizeSelection.push(primitive.copy());
      primitive.toShow = false;
    });
    this.translation = new Point(0, 0);
  }

  updateResize(primitivesSelected: SVGPrimitive[], translation: Point, keepAspectRatio: boolean, isSymetrical: boolean): void {
    this.translation.addPoint(translation);
    this.resizeSelection = [];
    primitivesSelected.forEach((primitive: SVGPrimitive) => {
      primitive.toShow = true;
      this.resizeSelection.push(primitive.copy());
      primitive.toShow = false;
    });
    this.calculateNewScaleFactors(this.translation, this.handleType, keepAspectRatio, isSymetrical);
    this.resizeSelection.forEach((primitive: SVGPrimitive) => {
      primitive.scale(this.getRelativeTranslation(primitive), this.getScaleFactorX(), this.getScaleFactorY());
    });
  }

  endResize(primitivesSelected: SVGPrimitive[], translation: Point, keepAspectRatio: boolean, isSymetrical: boolean): ResizeCommand {
    this.translation = translation;
    const translationMap = new Map<number, Point>();
    this.calculateNewScaleFactors(this.translation, this.handleType, keepAspectRatio, isSymetrical);
    primitivesSelected.forEach((primitive: SVGPrimitive, index: number) => {
      translationMap.set(index, this.getRelativeTranslation(primitive));
      primitive.toShow = true;
    });
    this.resizeSelection = [];
    return new ResizeCommand(primitivesSelected, translationMap, this.getScaleFactorX(), this.getScaleFactorY());
  }

  resetResizeValues(): void {
    this.initialBoundingBox = new Rectangle(Color.WHITE, Color.BLACK, 2, StrokeType.Outline, new Point(0, 0));
    this.scaleFactorX = 1;
    this.scaleFactorY = 1;
    this.translation.x = 0;
    this.translation.y = 0;
  }

  getRelativeTranslation(primitive: SVGPrimitive): Point {
    const boundingBoxSizeX = this.initialBoundingBox.getAbsoluteWidth();
    const boundingBoxSizeY = this.initialBoundingBox.getAbsoluteHeight();
    const translation: Point = new Point(0, 0);
    const oldCenter: Point = this.initialBoundingBox.getCenter();
    const distanceToOldCenterOfBoundingBox: Point = Point.substractPoints(primitive.getCenter(), oldCenter);
    if (this.isSymetrical) {
      translation.x = distanceToOldCenterOfBoundingBox.x * (this.scaleFactorX - 1);
      translation.y = distanceToOldCenterOfBoundingBox.y * (this.scaleFactorY - 1);
    } else {
      const newCenter: Point = Point.copyPoint(oldCenter);
      newCenter.x += (this.isLeftHandle(this.handleType) ? -1 : 1) * boundingBoxSizeX / 2.0 * (this.scaleFactorX - 1);
      newCenter.y += (this.isTopHandle(this.handleType) ? -1 : 1) * boundingBoxSizeY / 2.0 * (this.scaleFactorY - 1);
      const distanceToNewCenterOfBoundingBox: Point = Point.substractPoints(primitive.getCenter(), newCenter);
      translation.x = distanceToOldCenterOfBoundingBox.x * (this.scaleFactorX) - distanceToNewCenterOfBoundingBox.x;
      translation.y = distanceToOldCenterOfBoundingBox.y * (this.scaleFactorY) - distanceToNewCenterOfBoundingBox.y;
    }
    return translation;
  }

  calculateNewScaleFactors(translation: Point, handleType: HandleType, keepAspectRatio: boolean, isSymetrical: boolean): void {
    this.isSymetrical = isSymetrical;
    let oldBoundingBoxSizeY: number;
    let oldBoundingBoxSizeX: number;

    if (this.initialBoundingBox.getAbsoluteHeight() && this.initialBoundingBox.getAbsoluteWidth()) {
      oldBoundingBoxSizeY = this.initialBoundingBox.getAbsoluteHeight();
      oldBoundingBoxSizeX = this.initialBoundingBox.getAbsoluteWidth();
    } else {
      this.scaleFactorY = 1;
      this.scaleFactorX = 1;
      return;
    }

    let newBoundingBoxSizeY = oldBoundingBoxSizeY;
    if (this.isTopHandle(handleType)) {
      newBoundingBoxSizeY -= isSymetrical ? 2.0 * translation.y : translation.y;
    } else if (this.isBottomHandle(handleType)) {
      newBoundingBoxSizeY += isSymetrical ? 2.0 * translation.y : translation.y;
    }
    this.scaleFactorY = newBoundingBoxSizeY / oldBoundingBoxSizeY;

    let newBoundingBoxSizeX = oldBoundingBoxSizeX;
    if (this.isLeftHandle(handleType)) {
      newBoundingBoxSizeX -= isSymetrical ? 2.0 * translation.x : translation.x;
    } else if (this.isRightHandle(handleType)) {
      newBoundingBoxSizeX += isSymetrical ? 2.0 * translation.x : translation.x;
    }
    this.scaleFactorX = newBoundingBoxSizeX / oldBoundingBoxSizeX;

    if (keepAspectRatio &&
      (handleType === HandleType.TopLeft || handleType === HandleType.TopRight || handleType === HandleType.BottomLeft
        || handleType === HandleType.BottomRight)) {
      this.scaleFactorX = this.scaleFactorY = (Math.max(Math.abs(this.scaleFactorX), Math.abs(this.scaleFactorY)));
    }
  }

  getTranslation(): Point {
    return this.translation;
  }

  getScaleFactorX(): number {
    return this.scaleFactorX;
  }

  getScaleFactorY(): number {
    return this.scaleFactorY;
  }

  private isLeftHandle(handleType: HandleType): boolean {
    return handleType === HandleType.BottomLeft || handleType === HandleType.Left || handleType === HandleType.TopLeft;
  }

  private isRightHandle(handleType: HandleType): boolean {
    return handleType === HandleType.BottomRight || handleType === HandleType.Right || handleType === HandleType.TopRight;
  }

  private isTopHandle(handleType: HandleType): boolean {
    return handleType === HandleType.TopLeft || handleType === HandleType.Top || handleType === HandleType.TopRight;
  }

  private isBottomHandle(handleType: HandleType): boolean {
    return handleType === HandleType.BottomLeft || handleType === HandleType.Bottom || handleType === HandleType.BottomRight;
  }
}
