import { Color } from '../../utils/color';
import { LineCap, LineJoin, Pattern, PrimitiveType } from '../../utils/constantsAndEnums';
import { Point } from '../../utils/point';
import { SVGPrimitive } from '../svgPrimitive';

export class Line extends SVGPrimitive {

  constructor(strokeColor: Color,
              strokeWidth: number,
              pattern: Pattern,
              lineJoin: LineJoin,
              lineCap: LineCap,
              circleRadius: number,
              lineRounding: number) {
    super();
    this.strokeColor = Color.copyColor(strokeColor);
    this.strokeWidth = strokeWidth;
    this.pattern = pattern;
    this.lineJoin = lineJoin;
    this.lineCap = lineCap;
    this.circleRadius = circleRadius;
    this.lineRounding = lineRounding;
  }

  type = PrimitiveType.Line;
  selectable = true;
  selected = false;
  strokeColor: Color;
  strokeWidth: number;
  points: Point[] = [];
  tempPoint: Point;
  linePoints = '';                          // Le string de points utilisé dans le html
  pattern: Pattern;                         // Le motif de la ligne
  lineCap: LineCap;                         // Permet de dèfinir la forme de la fin des lignes
  lineJoin: LineJoin;                       // Permet de définir la forme de la jonction des lignes.
  circlePoints: Point[] = [];
  circleRadius: number;
  lineRounding: number;
  topLeftCorner: Point;
  bottomRightCorner: Point;

  static createCopy(primitive: SVGPrimitive): Line {
    const line: Line = primitive as Line;
    const newLine: Line = new Line(Color.copyColor(line.strokeColor),
    line.strokeWidth, line.pattern, line.lineJoin, line.lineCap, line.circleRadius, line.lineRounding);
    newLine.points = line.points;
    newLine.tempPoint = line.tempPoint;
    newLine.linePoints = line.linePoints;
    newLine.circlePoints = line.circlePoints;
    newLine.topLeftCorner = line.topLeftCorner;
    newLine.bottomRightCorner = line.bottomRightCorner;
    newLine.tempPoint = line.tempPoint;
    return newLine;
    }

  addPoint(point: Point): void {
    this.points.push(point);
    this.tempPoint = point;
  }

  update(position: Point): void {
    this.tempPoint = position;
    this.lineJoin !== LineJoin.BezierRound ? this.setPath() : this.setRoundingPath();
  }

  setPath(): void {
    let path = '';
    this.points.forEach((point) => {
      if (path.length === 0) {
        path += `M${point.x} ${point.y}`;
      } else {
        path += ` L${point.x} ${point.y}`;
      }
  });
    path += ` L${this.tempPoint.x} ${this.tempPoint.y}`;
    this.linePoints = path;
  }

  /*
   * Cette méthode permet de générer la commande de la courbe de Bezier
   * lorsque l'option special rouding est activée.
  */
  setRoundingPath(): void {
    let path = '';
    if (path.length === 0) {
      path = `M${this.points[0].x} ${this.points[0].y} L${this.points[0].x} ${this.points[0].y}`;
    }
    if (this.points.length >= 2 ) {
      path += ` L${this.points[1].x + ((this.points[0].x -
        this.points[1].x) * 0.1)} ${this.points[1].y + ((this.points[0].y - this.points[1].y) * 0.1)}`;
    }
    if (this.points.length >= 3) {
      for (let i = 3; i <= this.points.length; i++) {
        path += `${this.roundingButt(this.points[i - 3], this.points[i - 2], this.points[i - 1], this.lineRounding)}`;
      }
      const len = this.points.length;
      path += `${this.roundingButt(this.points[len - 2], this.points[len - 1], this.tempPoint, this.lineRounding)}`;
      path += ` L${this.tempPoint.x} ${this.tempPoint.y}`;
    }
    path += ` L${this.tempPoint.x} ${this.tempPoint.y}`;
    this.linePoints = path;
  }

  /*
   * Cette méthode permet d'implémenter la courbe de Bezier à la jonction des lignes SVG.
   Les paramètres correspondent aux point de la commande "C x1 y1, x y , x2 y2" pour la primitive <path> de SVG
   * @param startCtrlPoint, correspond au point de controle de la courbe :x1 y1.
   * @param slopeCtrlPoint, correspond au point courant: x y
   * @param endCtrlPoint, correspont au point de fin: x2 y2
   * @param roundingFactor est le rayon de courbure de la courbe.
   * @returns La méthode retourne la commande "C x1 y1, x y , x2 y2".
  */
  roundingButt(startCtrlPoint: Point, slopeCtrlPoint: Point, endCtrlPoint: Point, roundingFactor: number): string {

    const adjustedStartCtrlPt: Point = new Point(0, 0);
    const adjustedEndCtrlPt: Point = new Point(0, 0);

    if ((startCtrlPoint.x - slopeCtrlPoint.x) === 0 || (endCtrlPoint.x - slopeCtrlPoint.x) === 0) {
      return ` C${startCtrlPoint.x} ${startCtrlPoint.y}, ${slopeCtrlPoint.x} ${slopeCtrlPoint.y},
      ${endCtrlPoint.x} ${endCtrlPoint.y}`;
    }
    adjustedStartCtrlPt.x = Math.sign(startCtrlPoint.x - slopeCtrlPoint.x) *
        roundingFactor *
        Math.sqrt(1 / (1 + Math.pow((startCtrlPoint.y - slopeCtrlPoint.y) / (startCtrlPoint.x - slopeCtrlPoint.x), 2))) + slopeCtrlPoint.x;

    adjustedStartCtrlPt.y = Math.sign((startCtrlPoint.y - slopeCtrlPoint.y) ) *
        roundingFactor *
        ((startCtrlPoint.y - slopeCtrlPoint.y) / (startCtrlPoint.x - slopeCtrlPoint.x)) *
        Math.sqrt(1 / (1 + Math.pow((startCtrlPoint.y - slopeCtrlPoint.y) / (startCtrlPoint.x - slopeCtrlPoint.x), 2))) + slopeCtrlPoint.y;

    adjustedEndCtrlPt.x =  Math.sign((endCtrlPoint.x - slopeCtrlPoint.x)) *
          roundingFactor *
          Math.sqrt(1 / (1 + Math.pow((endCtrlPoint.y - slopeCtrlPoint.y) / (endCtrlPoint.x - slopeCtrlPoint.x), 2))) + slopeCtrlPoint.x;

    adjustedEndCtrlPt.y = Math.sign((endCtrlPoint.y - slopeCtrlPoint.y)) *
          roundingFactor * ((endCtrlPoint.y - slopeCtrlPoint.y) / (endCtrlPoint.x - slopeCtrlPoint.x)) *
          Math.sqrt(1 / (1 + Math.pow((endCtrlPoint.y - slopeCtrlPoint.y) / (endCtrlPoint.x - slopeCtrlPoint.x), 2))) + slopeCtrlPoint.y;

    return ` C${adjustedStartCtrlPt.x} ${adjustedStartCtrlPt.y}, ${slopeCtrlPoint.x} ${slopeCtrlPoint.y},
    ${adjustedEndCtrlPt.x} ${adjustedEndCtrlPt.y}`;
  }
}
