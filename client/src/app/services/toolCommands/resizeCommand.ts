import { SVGPrimitive } from '../svgPrimitives/svgPrimitive';
import { Point } from '../utils/point';
import { ToolCommand } from './toolCommand';

export class ResizeCommand implements ToolCommand {
  private primitives: Map<number, SVGPrimitive> = new Map<number, SVGPrimitive>();
  private translations: Map<number, Point> = new Map<number, Point>();
  private reverseTranslations: Map<number, Point> = new Map<number, Point>();
  private scaleFactorX: number;
  private scaleFactorY: number;

  constructor(primitives: SVGPrimitive[], translations: Map<number, Point>, scaleFactorX: number, scaleFactorY: number) {
    primitives.forEach((primitive: SVGPrimitive, index: number) => {
      this.primitives.set(index, primitive);
      this.translations = translations;
    });
    this.scaleFactorX = scaleFactorX;
    this.scaleFactorY = scaleFactorY;
    this.translations.forEach((translation: Point, index: number) => {
      const reverseTranslation: Point = Point.copyPoint(translation);
      reverseTranslation.multiply(-1);
      this.reverseTranslations.set(index, reverseTranslation);
    });
  }

  apply(primitives: SVGPrimitive[]): void {
    this.primitives.forEach((primitive: SVGPrimitive, index: number) => {
      const translation: Point | undefined = this.translations.get(index);
      if (translation) {
        primitive.scale(translation, this.scaleFactorX, this.scaleFactorY);
      }
    });
  }

  cancel(primitives: SVGPrimitive[]): void {
    this.primitives.forEach((primitive: SVGPrimitive, index: number) => {
      const translation: Point | undefined = this.reverseTranslations.get(index);
      if (translation) {
        primitive.scale(translation, (1 / this.scaleFactorX), (1 / this.scaleFactorY));
      }
    });
  }
}
