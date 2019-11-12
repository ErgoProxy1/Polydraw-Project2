import { Color } from '../../utils/color';
import { PrimitiveType, StrokeType } from '../../utils/constantsAndEnums';
import { Point } from '../../utils/point';
import { Shape } from '../shape/shape';
import { SVGPrimitive } from '../svgPrimitive';

export class Polygon extends Shape {

  radius: number; // rayon du cercle dans lequel le polygone sera tracé
  sidesNumber: number; // nombre de côtés
  points: Point[] = []; // array de points
  listPoints = '';
  type = PrimitiveType.Polygon;

  constructor(fillColor: Color, strokeColor: Color, strokeWidth: number, strokeType: StrokeType,
              center: Point, sidesNumber: number = 3 , radius: number = 0) {
    super(fillColor, strokeColor, strokeWidth, strokeType, center, radius * 2, radius * 2);
    this.radius = radius;
    this.sidesNumber = sidesNumber;
    this.center = center;
  }

  static createCopy(primitive: SVGPrimitive): Polygon {
    const polygon: Polygon = primitive as Polygon;
    const newCenter: Point = new Point(polygon.center.x, polygon.center.y);
    const newPolygon: Polygon = new Polygon(Color.copyColor(polygon.fillColor), Color.copyColor(polygon.strokeColor),
      polygon.strokeWidth, polygon.strokeType, newCenter, polygon.sidesNumber, polygon.radius);

    newPolygon.points = polygon.points;
    newPolygon.listPoints = polygon.listPoints;
    newPolygon.width = polygon.width;
    newPolygon.height = polygon.height;
    newPolygon.absoluteHeight = polygon.absoluteHeight;
    newPolygon.absoluteWidth = polygon.absoluteWidth;
    newPolygon.corner1 = polygon.corner1;
    newPolygon.corner2 = polygon.corner2;

    return newPolygon;
  }

  resize(corner1: Point, corner2: Point, isRegular: boolean = true): void {
    if (corner1.x !== corner2.x && corner1.y !== corner2.y) {
    super.resize(corner1, corner2, isRegular);
    this.radius = Math.min(this.getAbsoluteWidth() / 2.0, this.getAbsoluteHeight() / 2.0);
    this.updatePoints(); }
  }

  pointsToString(): void {
    this.listPoints = '';
    for (const point of this.points) {
      const buffer: string = point.x + ' ' + point.y + ',';
      this.listPoints += buffer;
    }
    this.listPoints = this.listPoints.substring(0, this.listPoints.length - 1);
  }

  private updatePoints(): void {
    let minX: number = Number.MAX_SAFE_INTEGER;
    let maxX: number = Number.MIN_SAFE_INTEGER;
    let minY: number = Number.MAX_SAFE_INTEGER;
    let maxY: number = Number.MIN_SAFE_INTEGER;
    const angle: number = ((2 * Math.PI) / this.sidesNumber);
    const polygonAngle: number = ((this.sidesNumber - 2) * Math.PI) / this.sidesNumber;
    const hasOutline: boolean = this.strokeType === StrokeType.Outline || this.strokeType === StrokeType.FullWithOutline;
    const adjustRadius: number = hasOutline ? (this.strokeWidth * 0.5) / Math.sin(polygonAngle * 0.5) : 0;
    if (this.radius >= this.strokeWidth / 0.5 && hasOutline) {
      this.radius = this.radius - adjustRadius;
    } else if (this.radius <= this.strokeWidth / 0.5 && hasOutline) {
      this.radius = 0;
    }
    for (let i = 0; i <= this.sidesNumber ; i++) {
      this.points[i] = new Point((this.center.x) - this.radius * Math.sin(i * angle),
        (this.center.y ) - this.radius * Math.cos(i * angle));

      minX = Math.min(minX, this.points[i].x);
      maxX = Math.max(maxX, this.points[i].x);
      minY = Math.min(minY, this.points[i].y);
      maxY = Math.max(maxY, this.points[i].y);
    }
    this.updateCorners();
    this.pointsToString();
  }

  getCenter(): Point {
    return this.center;
  }
  copy(): SVGPrimitive {
    return Polygon.createCopy(this);
  }
}
