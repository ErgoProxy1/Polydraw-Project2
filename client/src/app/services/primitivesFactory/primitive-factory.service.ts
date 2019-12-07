import { Injectable } from '@angular/core';
import { Ellipse } from '../svgPrimitives/ellipse/ellipse';
import { Line } from '../svgPrimitives/line/line';
import { FillingPath } from '../svgPrimitives/path/fillPath/fillPath';
import { Path } from '../svgPrimitives/path/path';
import { Pen } from '../svgPrimitives/pen/pen';
import { Polygon } from '../svgPrimitives/polygon/polygon';
import { Rectangle } from '../svgPrimitives/rectangle/rectangle';
import { Spraypaint } from '../svgPrimitives/spraypaint/spraypaint';
import { Stamp } from '../svgPrimitives/stamp/stamp';
import { SVGPrimitive } from '../svgPrimitives/svgPrimitive';
import { TextPrimitive } from '../svgPrimitives/text/textPrimitive';
import { PrimitiveType } from '../utils/constantsAndEnums';
import { Quill } from '../svgPrimitives/quill/quill';
@Injectable({
  providedIn: 'root',
})
export class PrimitiveFactoryService {

  generatePrimitives(primitivesToGenerate: string): SVGPrimitive[] {
    const primitives: SVGPrimitive[] = [];
    const tabTemp: SVGPrimitive[] = JSON.parse(primitivesToGenerate);
    tabTemp.forEach((prim: SVGPrimitive) => {
      let primitive: SVGPrimitive | undefined;
      switch (prim.type) {
        case PrimitiveType.Ellipse: {
          primitive = Ellipse.createCopy(prim);
          break;
        }
        case PrimitiveType.Line: {
          primitive = Line.createCopy(prim);
          break;
        }
        case PrimitiveType.Pen: {
          primitive = Pen.createCopy(prim);
          break;
        }
        case PrimitiveType.Paint: {
          primitive = Path.createCopy(prim);
          break;
        }
        case PrimitiveType.Pencil: {
          primitive = Path.createCopy(prim);
          break;
        }
        case PrimitiveType.Fill: {
          primitive = FillingPath.createCopy(prim);
          break;
        }
        case PrimitiveType.Spraypaint: {
          primitive = Spraypaint.createCopy(prim);
          break;
        }
        case PrimitiveType.Quill: {
          primitive = Quill.createCopy(prim);
          break;
        }
        case PrimitiveType.Rectangle: {
          primitive = Rectangle.createCopy(prim);
          break;
        }
        case PrimitiveType.Stamp: {
          primitive = Stamp.createCopy(prim);
          break;
        }
        case PrimitiveType.Polygon: {
          primitive = Polygon.createCopy(prim);
          break;
        }
        case PrimitiveType.Text: {
          primitive = TextPrimitive.createCopy(prim);
          break;
        }
      }
      if (primitive) {
        primitives.push(primitive);
      }
    });

    return primitives;
  }
}
