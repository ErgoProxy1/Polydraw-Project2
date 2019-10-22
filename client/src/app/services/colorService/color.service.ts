import { Injectable } from '@angular/core';
import { Color, MAX_ALPHA, MAX_RGB } from '../utils/color';

@Injectable({
  providedIn: 'root',
})
export class ColorService {

  lastColorsUsed: Color[] = [new Color(255, 0, 0, 1), new Color(0, 255, 0, 1),
  new Color(0, 0, 255, 1), new Color(204, 0, 255, 1), new Color(1, 255, 255, 1)];

  // Convertie les couleurs RGB en Hex
  convertRgbToHex(color: Color): string {
    const hexes: string[] = [Number(color.r).toString(16).toUpperCase(),
    Number(color.g).toString(16).toUpperCase(),
    Number(color.b).toString(16).toUpperCase()];
    for (let i = 0; i < 3; i++) {
      if (hexes[i].length < 2) {
        hexes[i] = '0' + hexes[i];
      }
    }
    const hexString = '';
    return  '#' + hexString.concat(hexes[0], hexes[1], hexes[2]);
  }

  // Convertie les couleurs Hex en RGB
  convertHextoRgb(currentHex: string): Color {
    const redHex = '';
    const greenHex = '';
    const blueHex = '';
    return new Color (parseInt(redHex.concat(currentHex[0], currentHex[1]), 16),
    parseInt(greenHex.concat(currentHex[2], currentHex[3]), 16),
    parseInt(blueHex.concat(currentHex[4], currentHex[5]), 16));
  }

  // Corrige les inputs de l'utilisateur invalides dans le champ du Hex
  correctHexInput(currentHex: string): string {
    const regex: RegExp = /[^A-F0-9]/;
    return currentHex.replace(regex, '');
  }

  // S'assure que les valeurs RGB entree sont valides
  confirmRGBColor(color: Color): boolean {
    if (color.r <= MAX_RGB && color.r >= 0 &&
      color.g <= MAX_RGB && color.g >= 0 &&
      color.b <= MAX_RGB && color.b >= 0) {
        return false;
    } else {
      return true;
    }
  }

  // Ajoute le # aux valeurs Hex afin de pouvoir les passer au html
  stringToHexForm(hex: string): string {
    const paletteString = '#';
    return paletteString.concat(hex);
  }

  // Corrige les inputs de l'utilisateur invalides dans les champs du alpha
  confirmAlpha(alpha: number): number {
    if (alpha >= 0 && alpha <= MAX_ALPHA) {
      return alpha;
    } else {
      return 1;
    }
  }
  // Utilisation de la stack
  addNewColor(colorSelected: Color): void {
    for (const info of this.lastColorsUsed) {
      if (info.isEquivalent(colorSelected)) {
        const index: number = this.lastColorsUsed.indexOf(info);
        this.lastColorsUsed.splice(index, 1);
        this.lastColorsUsed  = this.decalageTableauCouleur(this.lastColorsUsed,
          info);
        return;
      }
    }
    this.lastColorsUsed = this.decalageTableauCouleur(this.lastColorsUsed,
      colorSelected);
      }

  // Decalage du tableau des dernieres couleurs utilisées
  decalageTableauCouleur(oldArray: Color[], lastColor: Color): Color[] {
    const tempColorStorage: Color[] = [];
    tempColorStorage[0] = new Color(lastColor.r, lastColor.g,
      lastColor.b, lastColor.a);
    for (let i  = 0; i < this.lastColorsUsed.length; i++) {
        tempColorStorage[i + 1] = oldArray[i];
    }
    if (tempColorStorage.length > 10) {
      tempColorStorage.pop();
    }
    return tempColorStorage;
  }
  getLastColorsUsed(): Color[] {
    return this.lastColorsUsed;
  }
}
