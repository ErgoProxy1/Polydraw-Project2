import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { SVGPrimitive } from '../svgPrimitives/svgPrimitive';
import { RotateCommand } from '../toolCommands/rotateCommand';
import { KeyboardEventType, ORIGIN } from '../utils/constantsAndEnums';
import { Point } from '../utils/point';

@Injectable({
  providedIn: 'root',
})
export class RotationService {

  rotationAngle = 0;
  private rotationRate = 15;
  private rotationAngleSubject: Subject<number> = new Subject<number>();
  rotationAngleObservable: Observable<number> = this.rotationAngleSubject.asObservable();
  private isAroundPrimitiveCenter = false;

  private boundingBoxCenter: Point = Point.copyPoint(ORIGIN);

  command: RotateCommand;

  rotatingSelection: SVGPrimitive[] = [];

  keyboardEvent(eventType: KeyboardEventType) {
    switch (eventType) {
      case KeyboardEventType.ShiftDown :
        this.isAroundPrimitiveCenter = true;
        break;
      case KeyboardEventType.ShiftUp :
        this.isAroundPrimitiveCenter = false;
        break;
      case KeyboardEventType.AltUp :
          this.rotationRate = 15;
          break;
      case KeyboardEventType.AltDown :
        this.rotationRate = 1;
        break;
      default:
        break;
    }
  }
  setNewAngle(angle: number) {
    this.rotationAngle = angle;
  }

  beginRotation(svgPrimitive: SVGPrimitive[], boundingBoxCenter: Point, newSelection: boolean): void {
    if (newSelection) {
      this.rotatingSelection = [];
      this.boundingBoxCenter = Point.copyPoint(boundingBoxCenter);
    }
    svgPrimitive.forEach((primitive: SVGPrimitive) => {
      primitive.setRotationGroupOrigin(this.boundingBoxCenter);
      this.rotatingSelection.push(primitive);
    });
    this.command = new RotateCommand(svgPrimitive, this.rotationAngle, this.isAroundPrimitiveCenter);
  }
  updateRotation(delta: number): void {
    this.updateRotationAngle(delta);
    this.rotatingSelection.forEach((primitive: SVGPrimitive) => {
      primitive.rotate(delta * this.rotationRate, this.isAroundPrimitiveCenter, false);
    });
    this.command.getCenter();
  }

  updateRotationFromProperties(angle: number): void {
    this.rotatingSelection.forEach((primitive: SVGPrimitive) => {
      primitive.rotate(angle, this.isAroundPrimitiveCenter, false);
    });
    this.command.getCenter();
  }

  endRotation(primitivesSelected: SVGPrimitive[]): void {
    if (this.command.centers.length > 0) {
      this.command.setLastCenters();
    }
    this.rotatingSelection = [];
    this.command = new RotateCommand(primitivesSelected, this.rotationAngle, this.isAroundPrimitiveCenter);
  }

  private updateRotationAngle(delta: number): void {
    let newAngle: number;
    newAngle = this.rotationAngle + delta * this.rotationRate;
    if (newAngle > 359 || newAngle < -359) {
      newAngle = 0;
    }
    this.rotationAngle = newAngle;
  }

  getTemporaryPrimitives(): SVGPrimitive[] {
    return this.rotatingSelection;
  }
  getAngle(): number {
    return this.rotationAngle;
  }
}
