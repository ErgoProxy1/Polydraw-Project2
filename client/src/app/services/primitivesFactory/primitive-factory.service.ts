import { Injectable } from '@angular/core';
import { Ellipse } from '../svgPrimitives/ellipse/ellispe';
import { Line } from '../svgPrimitives/line/line';
import { Path } from '../svgPrimitives/path/path';
import { Pen } from '../svgPrimitives/pen/pen';
import { Polygon } from '../svgPrimitives/polygon/polygon';
import { Rectangle } from '../svgPrimitives/rectangle/rectangle';
import { Stamp } from '../svgPrimitives/stamp/stamp';
import { SVGPrimitive } from '../svgPrimitives/svgPrimitive';
import { TextPrimitive } from '../svgPrimitives/text/textPrimitive';
import { PrimitiveType } from '../utils/constantsAndEnums';
@Injectable({
  providedIn: 'root',
})
export class PrimitiveFactoryService {

  generatePrimitives(primitivesToGenerate: string): SVGPrimitive[] {
    const primitives: SVGPrimitive[] = [];
    const tabTemp: SVGPrimitive[] = JSON.parse(primitivesToGenerate);
    tabTemp.forEach((prim: SVGPrimitive) => {
      switch (prim.type) {
        case PrimitiveType.Ellipse: {
          const ellipse: Ellipse = Ellipse.createCopy(prim);
          primitives.push(ellipse);
          break;
        }
        case PrimitiveType.Line: {
          const line: Line = Line.createCopy(prim);
          primitives.push(line);
          break;
        }
        case PrimitiveType.Pen: {
          const pen: Pen = Pen.createCopy(prim);
          primitives.push(pen);
          break;
        }
        case PrimitiveType.Paint: {
          const paint: Path = Path.createCopy(prim);
          primitives.push(paint);
          break;
        }
        case PrimitiveType.Pencil: {
          const path: Path = Path.createCopy(prim);
          primitives.push(path);
          break;
        }
        case PrimitiveType.Rectangle: {
          const rectangle: Rectangle = Rectangle.createCopy(prim);
          primitives.push(rectangle);
          break;
        }
        case PrimitiveType.Stamp: {
          const stamp: Stamp = Stamp.createCopy(prim);
          primitives.push(stamp);
          break;
        }
        case PrimitiveType.Polygon: {
          const polygon: Polygon = Polygon.createCopy(prim);
          primitives.push(polygon);
          break;
        }
        case PrimitiveType.Text: {
          const text: TextPrimitive = TextPrimitive.createCopy(prim);
          primitives.push(text);
          break;
        }
      }
    });

    return primitives;
  }
}
