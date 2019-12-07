import { Injectable } from '@angular/core';
import { FillingPath } from '../svgPrimitives/path/fillPath/fillPath';
import { Color } from '../utils/color';
import { Point } from '../utils/point';

@Injectable()
export class PaintBucketFillService {

  private firstPixelColor: Color;
  private canvas: CanvasRenderingContext2D;
  private canvasWidth: number;
  private canvasHeight: number;
  private pixelTable: number[][]; // 2 valeurs possible 0: pas même couleur, 1: même couleur
  private contourPixels: number[][]; // 2 valeurs possible 0: pas même couleur, 1: même couleur
  private tolerance: number;
  private pixels: Uint8ClampedArray;
  private topLeftShape: Point;
  private bottomRightShape: Point;
  private fillingPath: FillingPath;
  private startTime: number;
  private readonly MAX_TIME_MS = 3000;

  setUpInfos(canvas: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number,
             tolerance: number, fillingPath: FillingPath): void {
    this.canvas = canvas;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.pixelTable = this.generatePixelTable();
    this.contourPixels = this.generatePixelTable();
    this.tolerance = tolerance;
    this.getPixels();
    this.fillingPath = fillingPath;
  }

  //////////// ICCIICICI
  isTimeExceeded(): boolean {
    return Date.now() - this.startTime > this.MAX_TIME_MS;
  }

  startFilling(startPosition: Point): boolean {
    this.startTime = Date.now();
    delete this.firstPixelColor;
    this.firstPixelColor = Color.copyColor(this.getPixelColor(Math.round(startPosition.x), Math.round(startPosition.y)));
    this.findShape(Math.round(startPosition.x), Math.round(startPosition.y));
    this.drawContour();
    this.fillingPath.draw();
    this.fillingPath.setCorners(this.topLeftShape, this.bottomRightShape);
    const success = !this.isTimeExceeded();
    this.startTime = -1;
    return success;
  }

  private findShape(startingX: number, startingY: number): void {
    // création des coins absurdes
    this.topLeftShape = new Point(this.canvasWidth - 1, this.canvasHeight - 1);
    this.bottomRightShape = new Point(0, 0);
    const pointsQueue: Point[] = [];
    pointsQueue.push(new Point(startingX, startingY));
    while (pointsQueue.length > 0 && !this.isTimeExceeded()) {
      const currentPoint = pointsQueue.shift();
      if (currentPoint) {
        let x = currentPoint.x;
        const y = currentPoint.y;
        while (x < this.canvasWidth && this.isPixelMatching(x, y) && !this.isTimeExceeded()) {
          x++;
        }
        x--;

        let hasBottomLine = false;
        let hasTopline = false;
        this.fillingPath.fillingPoints.push(new Point(x, y));
        while (x >= 0 && this.isPixelMatching(x, y) && !this.isTimeExceeded()) {
          this.pixelTable[x][y] = 1;

          // pour le bounding box
          if (x < this.topLeftShape.x) {
            this.topLeftShape.x = x;
          } else if (x > this.bottomRightShape.x) {
            this.bottomRightShape.x = x;
          }

          if (y < this.topLeftShape.y) {
            this.topLeftShape.y = y;
          } else if (y > this.bottomRightShape.y) {
            this.bottomRightShape.y = y;
          }

          if (y + 1 < this.canvasHeight) {
            if (this.pixelTable[x][y + 1] === 0 && this.isPixelMatching(x, y + 1)) {
              if (!hasBottomLine) {
                pointsQueue.push(new Point(x, y + 1));
                hasBottomLine = true;
              }
            } else if (hasBottomLine && !this.isPixelMatching(x, y + 1)) {
              hasBottomLine = false;
            }
          }
          if (y - 1 >= 0) {
            if (this.pixelTable[x][y - 1] === 0 && this.isPixelMatching(x, y - 1)) {
              if (!hasTopline) {
                pointsQueue.push(new Point(x, y - 1));
                hasTopline = true;
              }
            } else if (hasTopline && !this.isPixelMatching(x, y - 1)) {
              hasTopline = false;
            }
          }
          x--;
        }
        this.fillingPath.fillingPoints.push(new Point(x + 1, y));
      }
    }
  }

  private drawContour(): void {
    this.createContour();
    const contour = this.contourPixels;
    let currentX: number;
    let currentY: number;
    let points = [];
    for (let x = this.topLeftShape.x; x <= this.bottomRightShape.x && !this.isTimeExceeded(); x++) {
      for (let y = this.topLeftShape.y; y <= this.bottomRightShape.y && !this.isTimeExceeded(); y++) {
        currentX = x;
        currentY = y;
        if (contour[currentX][currentY] === 1) {
          this.fillingPath.contourPoints.push({
            type: 'm',
            points: [new Point(currentX, currentY)],
          });
          points = [];
          let hasNext = true;
          while (hasNext && !this.isTimeExceeded()) {
            if (points.length < 9) { // pour prendre 1 point sur 9
              points.push(new Point(currentX, currentY));
            } else {
              this.fillingPath.contourPoints.push({
                type: 'c',
                points: [points[0], points[4], points[8]],
              });
              points = [];

            }
            contour[currentX][currentY] = 0;
            // premier niveau
            if (currentX + 1 < this.canvasWidth && contour[currentX + 1][currentY] === 1) {
              currentX++;
            } else if (currentX + 1 < this.canvasWidth && currentY + 1 < this.canvasHeight && contour[currentX + 1][currentY + 1] === 1) {
              currentX++;
              currentY++;
            } else if (currentY + 1 < this.canvasHeight && contour[currentX][currentY + 1] === 1) {
              currentY++;
            } else if (currentX - 1 >= 0 && currentY + 1 < this.canvasHeight && contour[currentX - 1][currentY + 1] === 1) {
              currentX--;
              currentY++;
            } else if (currentX - 1 >= 0 && contour[currentX - 1][currentY] === 1) {
              currentX--;
            } else if (currentX - 1 >= 0 && currentY - 1 >= 0 && contour[currentX - 1][currentY - 1] === 1) {
              currentX--;
              currentY--;
            } else if (currentY - 1 >= 0 && contour[currentX][currentY - 1] === 1) {
              currentY--;
            } else if (currentX + 1 < this.canvasWidth && currentY - 1 >= 0 && contour[currentX + 1][currentY - 1] === 1) {
              currentX++;
              currentY--;
            } else if (currentX + 2 < this.canvasWidth && contour[currentX + 2][currentY] === 1) { // deuxième niveau
              currentX += 2;
            } else if (currentX + 2 < this.canvasWidth && currentY + 1 < this.canvasHeight && contour[currentX + 2][currentY + 1] === 1) {
              currentX += 2;
              currentY++;
            } else if (currentX + 2 < this.canvasWidth && currentY + 2 < this.canvasHeight && contour[currentX + 2][currentY + 2] === 1) {
              currentX += 2;
              currentY += 2;
            } else if (currentX + 1 < this.canvasWidth && currentY + 2 < this.canvasHeight && contour[currentX + 1][currentY + 2] === 1) {
              currentX++;
              currentY += 2;
            } else if (currentY + 2 < this.canvasHeight && contour[currentX][currentY + 2] === 1) {
              currentY += 2;
            } else if (currentX - 1 >= 0 && currentY + 2 < this.canvasHeight && contour[currentX - 1][currentY + 2] === 1) {
              currentX--;
              currentY += 2;
            } else if (currentX - 2 >= 0 && currentY + 2 < this.canvasHeight && contour[currentX - 2][currentY + 2] === 1) {
              currentX -= 2;
              currentY += 2;
            } else if (currentX - 2 >= 0 && currentY + 1 < this.canvasHeight && contour[currentX - 2][currentY + 1] === 1) {
              currentX -= 2;
              currentY++;
            } else if (currentX - 2 >= 0 && contour[currentX - 2][currentY] === 1) {
              currentX -= 2;
            } else if (currentX - 2 >= 0 && currentY - 1 >= 0 && contour[currentX - 2][currentY - 1] === 1) {
              currentX -= 2;
              currentY--;
            } else if (currentX - 2 >= 0 && currentY - 2 >= 0 && contour[currentX - 2][currentY - 2] === 1) {
              currentX -= 2;
              currentY -= 2;
            } else if (currentX - 1 >= 0 && currentY - 2 >= 0 && contour[currentX - 1][currentY - 2] === 1) {
              currentX--;
              currentY -= 2;
            } else if (currentY - 2 >= 0 && contour[currentX][currentY - 2] === 1) {
              currentY -= 2;
            } else if (currentX + 1 < this.canvasWidth && currentY - 2 >= 0 && contour[currentX + 1][currentY - 2] === 1) {
              currentX++;
              currentY -= 2;
            } else if (currentX + 2 < this.canvasWidth && currentY - 2 >= 0 && contour[currentX + 2][currentY - 2] === 1) {
              currentX += 2;
              currentY -= 2;
            } else if (currentX + 2 < this.canvasWidth && currentY - 1 >= 0 && contour[currentX + 2][currentY - 1] === 1) {
              currentX += 2;
              currentY--;
            } else {
              hasNext = false;
            }

          }
          if (points.length >= 2) {
            this.fillingPath.contourPoints.push({
              type: 'c',
              points: [points[0], points[Math.floor(points.length / 2)], points[points.length - 1]],
            });
          } else if (points.length === 1) {
            this.fillingPath.contourPoints.push({
              type: 'l',
              points: [Point.copyPoint(points[0])],
            });
          }
        }
      }
    }
  }
  private createContour(): void {
    for (let x = this.topLeftShape.x; x <= this.bottomRightShape.x && !this.isTimeExceeded(); x++) {
      for (let y = this.topLeftShape.y; y <= this.bottomRightShape.y && !this.isTimeExceeded(); y++) {
        if (this.pixelTable[x][y] === 1) {
          if (x - 1 < 0 || x + 1 >= this.canvasWidth || y - 1 < 0 || y + 1 >= this.canvasHeight) {
            this.contourPixels[x][y] = 1;
          } else if (this.pixelTable[x + 1][y] === 0 || this.pixelTable[x - 1][y] === 0 ||
            this.pixelTable[x][y + 1] === 0 || this.pixelTable[x + 1][y - 1] === 0) {
            this.contourPixels[x][y] = 1;
          }
        }
      }
    }
  }
  private isPixelMatching(x: number, y: number): boolean {
    const colorToCheck = this.getPixelColor(x, y);
    const byte = 255;
    const redDifference = (Math.max(this.firstPixelColor.r, colorToCheck.r) - Math.min(this.firstPixelColor.r, colorToCheck.r)) / byte;
    const greenDifference = (Math.max(this.firstPixelColor.g, colorToCheck.g) - Math.min(this.firstPixelColor.g, colorToCheck.g)) / byte;
    const blueDifference = (Math.max(this.firstPixelColor.b, colorToCheck.b) - Math.min(this.firstPixelColor.b, colorToCheck.b)) / byte;
    return (redDifference + greenDifference + blueDifference) / 3 <= (this.tolerance / 100);
  }

  // Retourne une couleur représentant le pixel à la position
  private getPixelColor(x: number, y: number): Color {
    const realPosition = (x * 4) + (y * 4 * this.canvasWidth);
    return new Color(this.pixels[realPosition], this.pixels[realPosition + 1],
      this.pixels[realPosition + 2], this.pixels[realPosition + 3]);
  }

  // Génere le table de pixel représentant toutes les pixels de l'image
  private generatePixelTable(): number[][] {
    const tableTemp = new Array<number[]>(this.canvasWidth);
    for (let i = 0; i < tableTemp.length; i++) {
      tableTemp[i] = new Array<number>(this.canvasHeight);
      for (let j = 0; j < tableTemp[i].length; j++) {
        tableTemp[i][j] = 0;
      }
    }
    return tableTemp;
  }

  private getPixels(): void {
    this.pixels = (this.canvas.getImageData(0, 0, this.canvasWidth, this.canvasHeight) as ImageData).data;
  }
}
