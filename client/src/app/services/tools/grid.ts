import { SVGPrimitive } from '../svgPrimitives/svgPrimitive';
import { Color } from '../utils/color';
import { DEFAULT_GRID_ALPHA, KeyboardEventType, MAX_ALPHA, MAX_GRID_SIZE, MIN_GRID_ALPHA
, MIN_GRID_SIZE, MouseEventType, ToolType } from '../utils/constantsAndEnums';

import { Point } from '../utils/point';
import { Tool } from './tool';

export class Grid implements Tool {
  type = ToolType.GridTool;

  // readonly defaultSquareSize:number=10;
  private sizeOfSqare: number;
  colorStroke: Color;
  toShow: boolean;
  constructor() {
    this.sizeOfSqare = MIN_GRID_SIZE;
    this.colorStroke = new Color(0, 0, 0, DEFAULT_GRID_ALPHA);
    this.toShow = false;
  }

  changeTransparency(transparency: number) {
    if (transparency > MAX_ALPHA) {
      transparency = MAX_ALPHA;
    } else if (transparency < MIN_GRID_ALPHA) {
      transparency = MIN_GRID_ALPHA;
    }
    this.colorStroke.a = transparency;
  }

  // Méthode get and set de la taille d'un carré - Utile pour une validation avant d'assigner une valeur
  sizeOfSquare(size?: number): number {
    if (size && size < MIN_GRID_SIZE) {
      size = MIN_GRID_SIZE;
    } else if (size && size > MAX_GRID_SIZE) {
      size = MAX_GRID_SIZE;
    }
    this.sizeOfSqare = size ? size : this.sizeOfSqare;
    return this.sizeOfSqare;
  }

  mouseEvent(eventType: MouseEventType, position: Point, primitive?: SVGPrimitive | undefined): SVGPrimitive[] {
    return [];
  }
  keyboardEvent(eventType: KeyboardEventType, key: string): SVGPrimitive[] {
    return [];
  }
  mouseWheelEvent(delta: number): SVGPrimitive[] {
    return [];
  }
  isCommandReady(): boolean {
    return false;
  }
  getCommand(): null {
    return null;
  }

}
