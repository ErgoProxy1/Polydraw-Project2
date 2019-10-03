import { MAX_ALPHA, MAX_RGB } from './constantsAndEnums';

export class Color {

  constructor(r: number, g: number, b: number, a: number = MAX_ALPHA) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }

  static readonly BLACK: Color = new Color(0, 0, 0, MAX_ALPHA);
  static readonly WHITE: Color = new Color(MAX_RGB, MAX_RGB, MAX_RGB, MAX_ALPHA);

  r: number; // Valeur du rouge, variant de 0 a 255
  g: number; // Valeur du vert, variant de 0 a 255
  b: number; // Valeur du bleu, variant de 0 a 255
  a: number; // Valeur de l'opocite, variant de 0 a 1

  static copyColor(color: Color): Color {
    return new Color(color.r, color.g, color.b, color.a);
  }

  changeColor(r: number, g: number, b: number, a: number): void {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }

  asString(): string {
    return 'rgba(' + this.r + ',' + this.g + ',' + this.b + ',' + this.a + ')';
  }
}
