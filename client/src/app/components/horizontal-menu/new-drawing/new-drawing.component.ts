import { Component, ElementRef, NgModule, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { ColorService } from 'src/app/services/colorService/color.service';
import { KeyboardService } from 'src/app/services/keyboard/keyboard.service';
import { SVGPrimitive } from 'src/app/services/svgPrimitives/svgPrimitive';
import { Color, MAX_ALPHA, MAX_RGB } from 'src/app/services/utils/color';
import { KeyboardShortcutType, PALETTE_CHOICES_RGB } from 'src/app/services/utils/constantsAndEnums';
import { DrawingService } from '../../../services/drawing/drawing.service';
import { NewDrawingInfo } from '../../../services/utils/newDrawingInfo';
import { CanvasComponent } from '../../canvas/canvas.component';

@NgModule({
  imports: [
    CanvasComponent,
    FormBuilder,
    ReactiveFormsModule,
    FormsModule,
  ],
})

@Component({
  selector: 'app-new-drawing',
  templateUrl: './new-drawing.component.html',
  styleUrls: ['./new-drawing.component.scss'],
})

export class NewDrawingComponent implements OnDestroy {
  subscription: Subscription;
  readonly palettesChoicesRGB: Color[] = PALETTE_CHOICES_RGB;

  @ViewChild('newDrawModal', { static: true }) newDrawModal: ElementRef;

  newDrawingModalConfig: NgbModalOptions = {
    backdrop: 'static',
    centered: true,
    keyboard: false,
  };

  errorInColors = false;
  errorsInDimensions = false;
  newDrawingInfo: NewDrawingInfo;
  drawingForm: FormGroup;
  workspaceDimensions: number[] = [0, 0];
  currentColorHex = '#FFFFFF';
  currentAlpha = 1;
  primitivesPresent = false;

  private readonly MIN_CANVAS_SIZE = 50;
  private readonly MAX_CANVAS_SIZE = 5000;

  constructor(private formBuilder: FormBuilder, private keyboardService: KeyboardService,
              private drawingService: DrawingService, private modalService: NgbModal, private colorSelection: ColorService) {

    this.newDrawingInfo = new NewDrawingInfo(this.workspaceDimensions[0], this.workspaceDimensions[1], Color.WHITE);

    this.subscription = this.keyboardService.getKeyboardShortcutType().subscribe((keyboardShortcut: KeyboardShortcutType) => {
      if (keyboardShortcut === KeyboardShortcutType.CreateDrawing) {
        this.openModal();
      }
    });

    this.drawingForm = this.formBuilder.group({
      width: [this.workspaceDimensions[0]],
      height: [this.workspaceDimensions[1]],
      red: [MAX_RGB],
      green: [MAX_RGB],
      blue: [MAX_RGB],
      alpha: [MAX_ALPHA],
      hex: ['FFFFFF'],
    });

    this.drawingService.workspaceObservable.subscribe((data) => {
      this.confirmResentDimensions(data);
    });
    this.drawingService.primtivesObservable.subscribe((data) => {
      this.checkPrimitivesLength(data);
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  // Reset les valeurs du formulaire
  resetForm(): void {
    this.drawingForm.patchValue({
      width: this.workspaceDimensions[0],
      height: this.workspaceDimensions[1],
      red: MAX_RGB,
      green: MAX_RGB,
      blue: MAX_RGB,
      alpha: MAX_ALPHA,
      hex: 'FFFFFF',
    });
    this.currentColorHex = '#FFFFFF';
    this.errorInColors = false;
    this.errorsInDimensions = false;
    this.drawingForm.markAsPristine();
  }

  // Soumet les donnés du formulaire de creation d'un nouveau dessin
  newDrawing(drawingForm: FormGroup): void {
    if (this.checkDimensionValues()) {
      if (this.primitivesPresent) {
        if (!confirm('Cette action supprimera votre dessin actuel!')) {
          return;
        }
      }
      this.newDrawingInfo = new NewDrawingInfo(drawingForm.value.width, drawingForm.value.height,
        new Color(drawingForm.value.red, drawingForm.value.green, drawingForm.value.blue, drawingForm.value.alpha));
      this.primitivesPresent = false;
      this.drawingService.sendDrawingData(this.newDrawingInfo);
      this.resetForm();
    }
  }

  // Vérifie les dimensions entrées par l'utilisateur
  checkDimensionValues(): boolean {
    if (this.drawingForm.value.width >= this.MIN_CANVAS_SIZE && this.drawingForm.value.width <= this.MAX_CANVAS_SIZE
      && this.drawingForm.value.height >= this.MIN_CANVAS_SIZE && this.drawingForm.value.height <= this.MAX_CANVAS_SIZE) {
      this.errorsInDimensions = false;
      return true;
    } else {
      this.errorsInDimensions = true;
      return false;
    }
  }

  // Vérifie si il y a des primitives présentes sur le dessin
  checkPrimitivesLength(primitives: SVGPrimitive[]): void {
    this.primitivesPresent = (primitives.length !== 0);
  }

  // Applique la couleur RBG. Convertie aussi le RGB en Hex.
  confirmRGBColor(): void {
    const currentRGB: Color =  new Color(this.drawingForm.value.red,
    this.drawingForm.value.green, this.drawingForm.value.blue);
    this.errorInColors = !this.colorSelection.isColorValid(currentRGB);
    const converted: string = this.colorSelection.convertRgbToHex(currentRGB);
    this.drawingForm.patchValue({ hex: converted.split('#')[1] });
    this.currentColorHex = converted;
  }

  // Confirme la valeur du alpha. Valeur est mise a 1 si une erreur est detecté
  confirmAlpha(): void {
    this.currentAlpha = this.colorSelection.confirmAlpha(this.drawingForm.value.alpha);
    this.drawingForm.patchValue({ alpha: this.currentAlpha });
  }

  // Applique la couleur HEX. Convertie aussi le Hex en RGB.
  confirmHexColor(): void {
    const currentHex: string = this.drawingForm.value.hex;
    if (currentHex.length === 6) {
      this.errorInColors = false;
      const converted: Color = this.colorSelection.convertHextoRgb(currentHex);
      this.drawingForm.patchValue({ red: converted.r, green: converted.g, blue: converted.b });
      const formattedHex = '';
      this.currentColorHex = formattedHex.concat('#', currentHex);
      const paletteString = '#';
      this.currentColorHex = paletteString.concat(currentHex);
    } else {
      this.errorInColors = true;
    }
  }

  // Empêche l'utilisateur d'entrer des valeurs non-hexadecimales
  correctHexInput(): void {
    this.drawingForm.patchValue({ hex: this.colorSelection.correctHexInput(this.drawingForm.value.hex.toUpperCase()) });
  }

  // Confirme les dimensions en fonction des valeurs transmises par le workspace et de si les controles ont été modifier (dirty)
  confirmResentDimensions(dimensions: number[]): void {
    if (!this.drawingForm.dirty) {
      this.workspaceDimensions = dimensions;
      this.drawingForm.patchValue({
        width: this.workspaceDimensions[0],
        height: this.workspaceDimensions[1],
      });
    }
  }

  // Update les valeurs de couleur en fonction de la couleur cliquer sur la palette
  updateFromPalette(color: Color): void {
    this.drawingForm.markAsDirty();
    const currentHex: string = this.colorSelection.convertRgbToHex(color);
    this.currentColorHex = currentHex;
    this.drawingForm.patchValue({ hex: currentHex.split('#')[1] });
    this.confirmHexColor();
    this.confirmAlpha();
    this.confirmRGBColor();
  }

  // Ouvre la fenêtre modal quand le bouton ou CTRL+o est appuyé
  openModal(): boolean {
    this.keyboardService.modalWindowActive = true;
    this.modalService.open(this.newDrawModal, this.newDrawingModalConfig);
    this.resetForm();
    return this.modalService.hasOpenModals();
  }

  // Ferme la fenêtre modal
  closeModal(): boolean {
    this.keyboardService.modalWindowActive = false;
    this.modalService.dismissAll();
    return this.modalService.hasOpenModals();
  }
}
