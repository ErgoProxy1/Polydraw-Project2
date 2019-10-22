export class Point {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  static copyPoint(point: Point): Point {
    return new Point(point.x, point.y);
  }

  addPoint(point: Point): Point {
    return new Point(this.x + point.x, this.y + point.y);
  }

  addXY(x: number, y: number): Point {
    return new Point(this.x + x, this.y + y);
  }
}
