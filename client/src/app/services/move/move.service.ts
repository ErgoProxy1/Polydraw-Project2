import { Injectable } from '@angular/core';
import { SVGPrimitive } from '../svgPrimitives/svgPrimitive';
import { MoveCommand } from '../toolCommands/moveCommand';
import { Point } from '../utils/point';

@Injectable({
  providedIn: 'root',
})
export class MoveService {
  private movingSelection: SVGPrimitive[] = [];

  beginMove(primitivesSelected: SVGPrimitive[]): void {
    this.movingSelection = [];
    primitivesSelected.forEach((primitive: SVGPrimitive) => {
      this.movingSelection.push(primitive.copy());
      primitive.toShow = false;
    });
  }

  updateMove(translation: Point): void {
    this.movingSelection.forEach((primitive: SVGPrimitive) => {
      primitive.move(translation);
    });
  }

  endMove(primitivesSelected: SVGPrimitive[], translation: Point): MoveCommand {
    primitivesSelected.forEach((primitive: SVGPrimitive) => {
      primitive.toShow = true;
    });
    this.movingSelection = [];
    return new MoveCommand(primitivesSelected, translation);
  }

  getTemporaryPrimitives(): SVGPrimitive[] {
    return this.movingSelection;
  }
}
