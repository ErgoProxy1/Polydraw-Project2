import { ElementRef, Injectable } from '@angular/core';
import { SVGPrimitive } from '../svgPrimitives/svgPrimitive';
import { Point } from '../utils/point';

@Injectable({
  providedIn: 'root',
})
export class BoundingBoxService {

  updatePrimitives(canvas: ElementRef, htmlOfPrimitives: ElementRef, primitives: SVGPrimitive[]) {
    const canvasElement: HTMLElement = (htmlOfPrimitives.nativeElement as HTMLElement);
    if (canvasElement) {
      const svgElements: HTMLCollection = (canvasElement as HTMLElement).children; // les elements HTML des primitives SVG;
      for (let i = 0; i < svgElements.length && i < primitives.length; i++) {
        const svgElement: SVGGraphicsElement = svgElements.item(i) as SVGGraphicsElement;
        if (svgElement) {
          this.setBoundingBoxOfPrimitive(canvas, svgElement, primitives[i]);
        }
      }
    }
  }

  private setBoundingBoxOfPrimitive(canvas: ElementRef, graphics: SVGGraphicsElement, primitive: SVGPrimitive) {
    const canvasElement: HTMLElement = (canvas.nativeElement as HTMLElement);
    // On ne defini les coins des primitives que si ce n'est pas deja fait
    if (canvasElement && graphics && primitive && !primitive.areCornersSet) {
      const xOffset: number = canvasElement.getBoundingClientRect().left;
      const yOffset: number = canvasElement.getBoundingClientRect().top;
      const bbox: DOMRect = graphics.getBoundingClientRect() as DOMRect;
      const topLeftCorner = new Point(bbox.x - xOffset, bbox.y - yOffset);
      const bottomRightCorner = new Point(bbox.x + bbox.width - xOffset, bbox.y + bbox.height - yOffset);
      primitive.setCorners(topLeftCorner, bottomRightCorner);
    }
  }
}
