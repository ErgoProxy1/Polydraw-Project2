import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ColorService } from 'src/app/services/colorService/color.service';
import { DrawingService } from 'src/app/services/drawing/drawing.service';
import { KeyboardShortcutService } from 'src/app/services/keyboardShortcut/keyboard-shortcut.service';
import { ToolsService } from 'src/app/services/tools/tools.service';
import { Color } from '../../services/utils/color';
import { MAX_ALPHA, PaletteChoiceInfo, PaletteChoices } from '../../services/utils/constantsAndEnums';

@Component({
  selector: 'app-color-tool',
  templateUrl: './color-tool.component.html',
  styleUrls: ['./color-tool.component.scss'],
})
export class ColorToolComponent {
  readonly paletteChoices: PaletteChoiceInfo[] = PaletteChoices;

  @ViewChild('paletteModal', { static: true }) paletteModal: ElementRef;

  paletteModalConfig: NgbModalOptions = {
    backdrop: 'static',
    centered: true,
    keyboard: false,
  };

  paletteForm: FormGroup;
  rgbaPrimaryColor: Color = Color.copyColor(Color.WHITE);
  rgbaSecondaryColor: Color = Color.copyColor(Color.BLACK);
  currentPrimaryHex = '#000000';
  currentHexSelectedColor = '';
  currentSecondaryHex = '#FFFFFF';
  primaryAlpha = 1;
  secondaryAlpha = 1;

  primarySelected = false;
  hexError = false;
  rgbaError = false;

  lastColorsUsed: PaletteChoiceInfo[] = [];

  constructor(private formBuilder: FormBuilder, private drawingService: DrawingService, private modalService: NgbModal,
              private keyboardShortcutService: KeyboardShortcutService, private toolsService: ToolsService,
              private colorService: ColorService) {
    this.paletteForm = this.formBuilder.group({
      hex: ['000000'],
      red: [0], green: [0], blue: [0],
    });
    this.rgbaPrimaryColor = this.toolsService.primaryColor;
    this.rgbaSecondaryColor = this.toolsService.secondaryColor;
    this.lastColorsUsed = this.colorService.lastColorsUsed;
    this.currentPrimaryHex = '#' + this.colorService.convertRgbToHex(
      this.rgbaPrimaryColor.r,
      this.rgbaPrimaryColor.g,
      this.rgbaPrimaryColor.b,
    );
    this.currentSecondaryHex = '#' + this.colorService.convertRgbToHex(
      this.rgbaSecondaryColor.r,
      this.rgbaSecondaryColor.g,
      this.rgbaSecondaryColor.b,
    );
    this.primaryAlpha = this.rgbaPrimaryColor.a;
    this.secondaryAlpha = this.rgbaSecondaryColor.a;
  }

  // Indique que l'utilisateur modifie la couleur primaire
  colorPrimarySelected(): void {
    this.primarySelected = true;
    this.paletteForm.patchValue({
      hex: this.currentPrimaryHex.split('#')[1],
      red: this.rgbaPrimaryColor.r,
      green: this.rgbaPrimaryColor.g,
      blue: this.rgbaPrimaryColor.b,
    });
    this.currentHexSelectedColor = this.currentPrimaryHex;
  }

  // Indique que l'utilisateur modifie la couleur secondaire
  colorSecondarySelected(): void {
    this.primarySelected = false;
    this.paletteForm.patchValue({
      hex: this.currentSecondaryHex.split('#')[1],
      red: this.rgbaSecondaryColor.r,
      green: this.rgbaSecondaryColor.g,
      blue: this.rgbaSecondaryColor.b,
    });
    this.currentHexSelectedColor = this.currentSecondaryHex;
  }

  // Determine la couleur cliquer sur la palette
  getClickedColor(mouseEvent: MouseEvent): void {
    this.currentHexSelectedColor = String((mouseEvent.target as SVGElement).getAttribute('fill'));
    this.paletteForm.patchValue({ hex: this.currentHexSelectedColor.split('#')[1] });
    this.confirmHexColor();
    this.confirmRGBColor();
    this.validateAlpha();
  }

  // Determine la couleur cliquer sur la l'historique des couleurschoisies
  getStackColor(mouseEvent: MouseEvent): void {
    this.currentPrimaryHex = String((mouseEvent.target as SVGElement).getAttribute('fill'));
    this.rgbaConversion();
  }

  // Applique la couleur aprés l'évènement Click sur OK
  applyClickedColor(paletteForm: FormGroup): void {
    const tampon: string = this.colorService.stringToHexForm(this.paletteForm.value.hex);
    if (this.primarySelected && !this.hexError) {
      this.currentPrimaryHex = tampon;
      this.rgbaConversion();
      this.addNewColor(tampon);
      this.toolsService.primaryColor = this.rgbaPrimaryColor;
    } else if (!this.primarySelected && !this.hexError) {
      this.currentSecondaryHex = tampon;
      this.rgbaConversion();
      this.addNewColor(tampon);
      this.toolsService.secondaryColor = this.rgbaSecondaryColor;
    }
  }

  // Inverse la couleur primaire et la secondaire
  switchColor(): void {
    const tamponHex: string = this.currentSecondaryHex;
    const tamponAlpha: number = this.secondaryAlpha;
    this.currentSecondaryHex = this.currentPrimaryHex;
    this.currentPrimaryHex = tamponHex;
    this.secondaryAlpha = this.primaryAlpha;
    this.primaryAlpha = tamponAlpha;
    this.rgbaConversion();
    this.toolsService.primaryColor = this.rgbaPrimaryColor;
    this.toolsService.secondaryColor = this.rgbaSecondaryColor;
  }

  // Confirme les valeurs hex et update les valeurs RGB du formulaire
  confirmHexColor(): void {
    const currentHex: string = this.colorService.correctHexInput(this.paletteForm.value.hex.toUpperCase());
    const currentRgbaSelectedColor: number[] = this.colorService.convertHextoRgb(currentHex);
    this.paletteForm.patchValue({
      red: currentRgbaSelectedColor[0],
      green: currentRgbaSelectedColor[1], blue: currentRgbaSelectedColor[2],
    });
    this.paletteForm.patchValue({ hex: currentHex });
    if (this.paletteForm.value.hex.length === 6) {
      this.hexError = false;
    } else {
      this.hexError = true;
    }
  }

  // Confirme les valeurs RGB et update les valeurs hex du formulaire
  confirmRGBColor(): void {
    const currentRGB: number[] = [this.paletteForm.value.red, this.paletteForm.value.green,
    this.paletteForm.value.blue];
    this.rgbaError = this.colorService.confirmRGBColor(currentRGB[0], currentRGB[1], currentRGB[2]);
    this.hexError = this.rgbaError;
    const converted: string = this.colorService.convertRgbToHex(currentRGB[0], currentRGB[1], currentRGB[2]);
    this.paletteForm.patchValue({ hex: converted });
    this.currentHexSelectedColor = this.colorService.stringToHexForm(converted);
  }

  // Verifie et assigne les valeurs alpha
  validateAlpha(): void {
    if (this.primaryAlpha > MAX_ALPHA) {
      this.primaryAlpha = MAX_ALPHA;
    } else if (this.primaryAlpha < 0) {
      this.primaryAlpha = 0;
    }
    if (this.secondaryAlpha > MAX_ALPHA) {
      this.secondaryAlpha = MAX_ALPHA;
    } else if (this.secondaryAlpha < 0) {
      this.secondaryAlpha = 0;
    }
    this.rgbaConversion();
  }

  // Convertie les valeurs hexademiales en RGB avant de les passer aux objets Color (Communication avec le tool service)
  rgbaConversion(): void {
    const rgb1: number[] = this.colorService.convertHextoRgb(this.currentPrimaryHex.split('#')[1]);
    const rgb2: number[] = this.colorService.convertHextoRgb(this.currentSecondaryHex.split('#')[1]);
    this.rgbaPrimaryColor.changeColor(rgb1[0], rgb1[1], rgb1[2], this.primaryAlpha);
    this.rgbaSecondaryColor.changeColor(rgb2[0], rgb2[1], rgb2[2], this.secondaryAlpha);
  }

  // Ajoute une couleur a la liste des couleurs deja utiliser.
  addNewColor(colorSelected: string): void {
    for (const info of this.lastColorsUsed) {
      if (info.color === colorSelected) { return; }
    }
    const tempColorStorage: PaletteChoiceInfo[] = [];
    tempColorStorage[0] = { positionX: 0, positionY: 0, color: colorSelected };
    for (let i = 0; i < this.lastColorsUsed.length; i++) {
      if (i < 4) {
        tempColorStorage[i + 1] = this.lastColorsUsed[i];
        tempColorStorage[i + 1].positionX += 40;
        tempColorStorage[i + 1].positionY = 0;
      } else if (i === 4) {
        tempColorStorage[i + 1] = this.lastColorsUsed[i];
        tempColorStorage[i + 1].positionX = 0;
        tempColorStorage[i + 1].positionY = 40;
      } else if (i) {
        tempColorStorage[i + 1] = this.lastColorsUsed[i];
        tempColorStorage[i + 1].positionX += 40;
        tempColorStorage[i + 1].positionY = 40;
      }
    }
    if (tempColorStorage.length > 10) {
      tempColorStorage.pop();
    }
    this.lastColorsUsed = tempColorStorage;
    this.colorService.lastColorsUsed = this.lastColorsUsed;
  }

  // Envoie la couleur primaire au canvas afin de changer la couleur de fond
  setBackgroundColor(): void {
    this.drawingService.sendBackgroundColorData(this.rgbaPrimaryColor);
  }

  // Ouvre la fenetre modale
  openModal(): void {
    this.keyboardShortcutService.setActiveModalStatus(true);
    this.modalService.open(this.paletteModal, this.paletteModalConfig);
  }

  // Ferme la fenetre modale
  closeModal(): void {
    this.keyboardShortcutService.setActiveModalStatus(false);
    this.modalService.dismissAll();
    this.hexError = false;
  }

  // Méthodes pour configurer le booléen correctement:
  setInactiveFocus(): void {
    this.keyboardShortcutService.setFocusActive(false);
  }

  setActiveFocus(): void {
    this.keyboardShortcutService.setFocusActive(true);
  }
}
