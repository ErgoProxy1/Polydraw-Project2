import { Injectable } from '@angular/core';
import { MAX_ALPHA, MAX_RGB, PaletteChoiceInfo } from '../utils/constantsAndEnums';

@Injectable({
  providedIn: 'root',
})
export class ColorService {

  lastColorsUsed: PaletteChoiceInfo[] = [];

  // Convertie les couleurs RGB en Hex
  convertRgbToHex(currentRed: number, currentGreen: number, currentBlue: number): string {
    const hexes: string[] = [Number(currentRed).toString(16).toUpperCase(),
    Number(currentGreen).toString(16).toUpperCase(),
    Number(currentBlue).toString(16).toUpperCase()];
    for (let i = 0; i < 3; i++) {
      if (hexes[i].length < 2) {
        hexes[i] = '0' + hexes[i];
      }
    }
    const hexString = '';
    return hexString.concat(hexes[0], hexes[1], hexes[2]);
  }

  // Convertie les couleurs Hex en RGB
  convertHextoRgb(currentHex: string): number[] {
    const redHex = '';
    const greenHex = '';
    const blueHex = '';
    return [parseInt(redHex.concat(currentHex[0], currentHex[1]), 16),
    parseInt(greenHex.concat(currentHex[2], currentHex[3]), 16),
    parseInt(blueHex.concat(currentHex[4], currentHex[5]), 16)];
  }

  // Corrige les inputs de l'utilisateur invalides dans le champ du Hex
  correctHexInput(currentHex: string): string {
    const regex: RegExp = /[^A-F0-9]/;
    return currentHex.replace(regex, '');
  }

  // S'assure que les valeurs RGB entree sont valides
  confirmRGBColor(red: number, green: number, blue: number): boolean {
    if (red <= MAX_RGB && red >= 0 &&
      green <= MAX_RGB && green >= 0 &&
      blue <= MAX_RGB && blue >= 0) {
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
}
