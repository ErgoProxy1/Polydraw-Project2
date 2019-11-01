import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ColorService } from 'src/app/services/colorService/color.service';
import { DrawingService } from 'src/app/services/drawing/drawing.service';
import { KeyboardShortcutService } from 'src/app/services/keyboardShortcut/keyboard-shortcut.service';
import { ToolsService } from 'src/app/services/tools/tools.service';
import { Color, MAX_ALPHA } from '../../services/utils/color';
import { PaletteChoicesRGB } from '../../services/utils/constantsAndEnums';

@Component({
  selector: 'app-color-tool',
  templateUrl: './color-tool.component.html',
  styleUrls: ['./color-tool.component.scss'],
})
export class ColorToolComponent {
  readonly palettesChoicesRGB: Color[] = PaletteChoicesRGB;

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

  lastColorsUsed: Color[] = [];

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
    this.currentPrimaryHex = this.colorService.convertRgbToHex(this.rgbaPrimaryColor);
    this.currentSecondaryHex = this.colorService.convertRgbToHex(this.rgbaSecondaryColor);
    this.primaryAlpha = this.rgbaPrimaryColor.a;
    this.secondaryAlpha = this.rgbaSecondaryColor.a;

    this.toolsService.eyeDropperPrimaryObservable.subscribe((data) => {
      this.setPrimaryFromEyeDropper(data);
    });
    this.toolsService.eyeDropperSecondaryObservable.subscribe((data) => {
      this.setSecondaryFromEyeDropper(data);
    });
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
  getClickedColor(color: Color): void {
    this.currentHexSelectedColor = this.colorService.convertRgbToHex(color);
    this.paletteForm.patchValue({ hex: this.currentHexSelectedColor.split('#')[1] });
    this.confirmHexColor();
    this.confirmRGBColor();
    this.validateAlpha();
  }

  // Determine la couleur cliquer sur la l'historique des couleurschoisies
  getStackColor(mouseEvent: MouseEvent, color: Color): void {
    if (mouseEvent.button === 0) {
      this.currentPrimaryHex = this.colorService.convertRgbToHex(color);
      this.rgbaConversion();
    } else if (mouseEvent.button === 2) {
      mouseEvent.preventDefault();
      mouseEvent.stopPropagation();
      this.currentSecondaryHex = this.colorService.convertRgbToHex(color);
      this.rgbaConversion();
    }
  }

  // Applique la couleur aprés l'évènement Click sur OK
  applyClickedColor(): void {
    const tampon: Color = this.colorService.convertHextoRgb(this.paletteForm.value.hex);
    if (this.primarySelected && !this.hexError) {
      this.currentPrimaryHex = this.colorService.convertRgbToHex(tampon);
      this.rgbaConversion();
      this.addNewColor(tampon);
      this.toolsService.primaryColor = this.rgbaPrimaryColor;
    } else if (!this.primarySelected && !this.hexError) {
      this.currentSecondaryHex = this.colorService.convertRgbToHex(tampon);
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
    const currentRgbaSelectedColor: Color = this.colorService.convertHextoRgb(currentHex);
    this.paletteForm.patchValue({
      red: currentRgbaSelectedColor.r,
      green: currentRgbaSelectedColor.g, blue: currentRgbaSelectedColor.b,
    });
    this.paletteForm.patchValue({ hex: currentHex });
    this.currentHexSelectedColor = '#' + currentHex;
    console.log(this.currentHexSelectedColor);
    if (this.paletteForm.value.hex.length === 6) {
      this.hexError = false;
    } else {
      this.hexError = true;
    }
  }

  // Confirme les valeurs RGB et update les valeurs hex du formulaire
  confirmRGBColor(): void {
    const currentRGB: Color = new Color(this.paletteForm.value.red, this.paletteForm.value.green,
    this.paletteForm.value.blue);
    this.rgbaError = this.colorService.confirmRGBColor(currentRGB);
    this.hexError = this.rgbaError;
    const converted: string = this.colorService.convertRgbToHex(currentRGB);
    this.paletteForm.patchValue({ hex: converted.split('#')[1] });
    this.currentHexSelectedColor = converted;
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
    const rgb1: Color = this.colorService.convertHextoRgb(this.currentPrimaryHex.split('#')[1]);
    const rgb2: Color = this.colorService.convertHextoRgb(this.currentSecondaryHex.split('#')[1]);
    this.rgbaPrimaryColor.changeColor(rgb1, this.primaryAlpha);
    this.rgbaSecondaryColor.changeColor(rgb2, this.secondaryAlpha);
  }

  // Ajoute une couleur a la liste des couleurs deja utiliser.
  addNewColor(colorSelected: Color): void {
    this.colorService.addNewColor(colorSelected);
    this.lastColorsUsed = this.colorService.getLastColorsUsed();
  }

  setPrimaryFromEyeDropper(color: Color) {
    this.primarySelected = true;
    this.paletteForm.patchValue({hex: this.colorService.convertRgbToHex(color).split('#')[1]});
    this.primaryAlpha = color.a;
    this.applyClickedColor();
    this.toolsService.primaryColor = color;
  }

  setSecondaryFromEyeDropper(color: Color) {
    this.primarySelected = false;
    this.paletteForm.patchValue({hex: this.colorService.convertRgbToHex(color).split('#')[1]});
    this.secondaryAlpha = color.a;
    this.applyClickedColor();
    this.toolsService.secondaryColor = color;
  }

  // Envoie la couleur primaire au canvas afin de changer la couleur de fond
  setBackgroundColor(): void {
    this.drawingService.sendBackgroundColorData(this.rgbaPrimaryColor);
  }

  // Ouvre la fenetre modale
  openModal() {
    this.keyboardShortcutService.modalWindowActive = true;
    this.modalService.open(this.paletteModal, this.paletteModalConfig);
  }

  // Ferme la fenetre modale
  closeModal() {
    this.keyboardShortcutService.modalWindowActive = false;
    this.modalService.dismissAll();
    this.hexError = false;
  }

  // Méthodes pour configurer le booléen correctement:
  setInactiveFocus() {
    this.keyboardShortcutService.inputFocusedActive = false;
  }

  setActiveFocus() {
    this.keyboardShortcutService.inputFocusedActive = true;
  }
}
