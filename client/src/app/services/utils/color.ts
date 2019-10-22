
export const MAX_RGB = 255;
export const MAX_ALPHA = 1;
export class Color {

  constructor(r: number, g: number, b: number, a: number = MAX_ALPHA) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
    this.asString();
  }

  static readonly BLACK: Color = new Color(0, 0, 0, MAX_ALPHA);
  static readonly WHITE: Color = new Color(MAX_RGB, MAX_RGB, MAX_RGB, MAX_ALPHA);

  r: number; // Valeur du rouge, variant de 0 a 255
  g: number; // Valeur du vert, variant de 0 a 255
  b: number; // Valeur du bleu, variant de 0 a 255
  a: number; // Valeur de l'opocite, variant de 0 a 1
  rgbaTextForm = '';
  static copyColor(color: Color): Color {
    return new Color(color.r, color.g, color.b, color.a);
  }

  changeColor(color: Color, a: number): void {
    this.r = color.r;
    this.g = color.g;
    this.b = color.b;
    this.a = a;
    this.asString();
  }

  asString(): string {
    this.rgbaTextForm = 'rgba(' + this.r + ',' + this.g + ',' + this.b + ',' + this.a + ')';
    if (this.a === 0) { this.rgbaTextForm = 'none'; }
    return this.rgbaTextForm;
  }
  isEquivalent(color: Color): boolean {
    if (this.r === color.r && this.g === color.g && this.b === color.b) {
      return true;
    } else {
      return false;
    }

  }
}
