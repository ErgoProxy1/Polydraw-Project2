import { Perimeter } from '../svgPrimitives/rectangle/perimeter/perimeter';
import { SVGPrimitive } from '../svgPrimitives/svgPrimitive';
import { TextPrimitive } from '../svgPrimitives/text/textPrimitive';
import { Color } from '../utils/color';
import { AlignInfo, FontInfo } from '../utils/constantsAndEnums';
import { LineInfo } from '../utils/lineInfo';
import { Point } from '../utils/point';
import { ToolCommand } from './toolCommand';

export class TextToolCommand implements ToolCommand {

  text: TextPrimitive;

  currentLine = 0;
  private currentChar = 0;
  private perimeter: Perimeter;

  constructor(size: number, textColor: Color, font: FontInfo, align: AlignInfo, position: Point, perimeter: Perimeter,
              bold: boolean, italics: boolean) {
    this.text = new TextPrimitive(size, textColor, font, align, position, bold, italics);
    this.text.lines[this.currentLine].innertext += '|';
    this.perimeter = perimeter;
  }

  // Permet d'inserer un symbol dans la zone de text
  type(key: string): void {
    if (key === ' ') {
      key = '\u00A0';
    }
    let currentLineText: string = this.text.lines[this.currentLine].innertext;
    currentLineText = currentLineText.replace('|', '');
    this.updateInnerText(currentLineText, key);
    this.updatePerimeter();
  }

  // Brise la ligne actuelle
  break(): void {
    let currentLineText: string = this.text.lines[this.currentLine].innertext;
    const splitText: string[] = currentLineText.split('|');
    currentLineText = currentLineText.replace('|', '');
    // Sous-cas ou il n'y a pas de text a droite du |
    if (splitText.length === 1) {
      splitText.push('');
    }
    currentLineText = splitText[0];
    this.text.lines[this.currentLine].innertext = currentLineText;
    this.currentLine++;
    this.moveLines(1);
    this.text.lines.splice(this.currentLine, 0, {
      innertext: ('|' + splitText[1]),
      position: new Point(
        this.text.position.x, this.text.lines[this.currentLine - 1].position.y + this.text.size,
      ),
    });
    this.currentChar = 0;
    this.updatePerimeter();
  }

  // Retire un symbol de la zone de texte
  delete(): void {
    let currentLineText: string = this.text.lines[this.currentLine].innertext;
    currentLineText = currentLineText.replace('|', '');
    // Cas 1: Text present sur la ligne
    if (currentLineText.length > 0) {
      // Sous-Cas: On est a une position autre que le debut de la ligne. On efface le charactere courant.
      if (this.currentChar > 0) {
        this.removeCurrentChar(currentLineText);
        this.updatePerimeter();
        // Sous-Cas: On est au debut d'une ligne en dessous de la premiere. On place le texte de la ligne actif a la ligne d'avant.
      } else if (this.currentLine !== 0 && this.currentChar === 0) {
        const lineToMove: LineInfo = this.text.lines.splice(this.currentLine, 1)[0];
        this.moveLines(-1);
        this.currentLine--;
        currentLineText = this.text.lines[this.currentLine].innertext;
        this.currentChar = currentLineText.length;
        currentLineText += lineToMove.innertext;
        this.text.lines[this.currentLine].innertext = currentLineText;
      }
      // Cas 2: Il n'y a pas de texte a une ligne qui n'est pas la premiere. On retourne a la ligne d'avant.
    } else if (this.currentLine !== 0) {
      this.text.lines.splice(this.currentLine, 1);
      this.moveLines(-1);
      this.currentLine--;
      currentLineText = this.text.lines[this.currentLine].innertext;
      if (currentLineText.length === 0) {
        currentLineText = '|';
      }
      this.text.lines[this.currentLine].innertext = currentLineText;
      this.currentChar = currentLineText.length;
      this.updatePerimeter();
    }
    // Cas 3: Il n'y a pas de texte a la premiere ligne. On ne fait rien.
  }

  private moveLines(direction: number): void {
    for (let i = this.currentLine; i < this.text.lines.length; i++) {
      this.text.lines[i].position.y += direction * this.text.size;
    }
  }

  // Change la position courante sur la ligne (et donc le | aussi)
  updateLinePosition(key: string): void {
    const currentLineText = this.text.lines[this.currentLine].innertext;
    switch (key) {
      case ('ArrowDown'):
        if (this.currentLine + 1 !== this.text.lines.length) {
          this.removePositionIndicator(currentLineText);
          // Longueur de la ligne en-dessous est plus petite que la position actuelle sur la ligne courante
          if (this.text.lines[this.currentLine + 1].innertext.length < this.currentChar) {
            this.currentChar = this.text.lines[this.currentLine + 1].innertext.length;
          }
          this.currentLine++;
          this.updatePositionIndicator(currentLineText);
          return;
        }
        break;
      case ('ArrowUp'):
        if (this.currentLine !== 0) {
          this.removePositionIndicator(currentLineText);
          // Longueur de la ligne du dessus est plus petite que la position actuelle sur la ligne courante
          if (this.text.lines[this.currentLine - 1].innertext.length < this.currentChar) {
            this.currentChar = this.text.lines[this.currentLine - 1].innertext.length;
          }
          this.currentLine--;
          this.updatePositionIndicator(currentLineText);
          return;
        }
        break;
      case ('ArrowLeft'):
        if (this.currentChar !== 0) {
          this.removePositionIndicator(currentLineText);
          this.currentChar--;
          this.updatePositionIndicator(currentLineText);
          return;
        }
        break;
      case ('ArrowRight'):
        if (this.currentChar + 1 !== currentLineText.length) {
          this.removePositionIndicator(currentLineText);
          this.currentChar++;
          this.updatePositionIndicator(currentLineText);
          return;
        }
        break;
    }
  }

  // Ajoute l'indicateur de position (|) entre deux characteres
  private updatePositionIndicator(currentLineText: string): void {
    currentLineText = this.text.lines[this.currentLine].innertext;
    currentLineText = currentLineText.slice(0, this.currentChar) + '|' + currentLineText.slice(this.currentChar);
    this.text.lines[this.currentLine].innertext = currentLineText;
  }

  // Retire l'indicateur de position (|)
  private removePositionIndicator(currentLineText: string): void {
    currentLineText = currentLineText.replace('|', '');
    this.text.lines[this.currentLine].innertext = currentLineText;
  }

  // Met a jour le text de la ligne actif a la position courante (La ou '|' est present)
  private updateInnerText(currentLineText: string, key: string): void {
    currentLineText =
      currentLineText.substring(0, this.currentChar)
      + (key + '|')
      + currentLineText.substring(this.currentChar, currentLineText.length);

    this.currentChar++;
    this.text.lines[this.currentLine].innertext = currentLineText;
  }

  // Retire le charactere a la position courante (La ou '|' est present)
  private removeCurrentChar(currentLineText: string): void {
    if (this.currentChar > 0) {
      this.currentChar--;
      currentLineText = currentLineText.substring(0, this.currentChar) + '|'
        + currentLineText.substring(this.currentChar + 1, currentLineText.length);
      this.text.lines[this.currentLine].innertext = currentLineText;
    }
  }

  // Met le perimetre pointille a jour
  updatePerimeter(): void {
    this.perimeter.resize(this.text.getTopLeftCorner(), this.text.getBottomRightCorner());
  }

  apply(primitives: SVGPrimitive[]): void {
    primitives.push(this.text);
  }

  cancel(primitives: SVGPrimitive[]): void {
    const index = primitives.indexOf(this.text, 0);
    if (index > -1) {
      primitives.splice(index, 1);
    }
  }
}
