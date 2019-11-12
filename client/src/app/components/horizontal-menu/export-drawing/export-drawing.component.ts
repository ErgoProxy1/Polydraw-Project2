import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { ControllerService } from 'src/app/services/controller/controller.service';
import { KeyboardService } from 'src/app/services/keyboard/keyboard.service';
import { DrawingCommunicationService } from 'src/app/services/serverCommunication/drawing-communication.service';
import { CanvasToBMP } from 'src/app/services/utils/canvasToBMP';
import { EXPORT_TYPES, ExportType, ExportTypeInterface, KeyboardShortcutType } from 'src/app/services/utils/constantsAndEnums';
import { ExportInfo } from 'src/app/services/utils/exportInfo';

@Component({
  selector: 'app-export-drawing',
  templateUrl: './export-drawing.component.html',
  styleUrls: ['./export-drawing.component.scss'],
})
export class ExportDrawingComponent implements OnDestroy {

  readonly EXPORT_TYPES: ExportTypeInterface[] = EXPORT_TYPES;

  private subscription: Subscription;
  private canvasElement: HTMLCanvasElement; // Assigner au nativeElement du canvasSim
  exportError = false;
  exportInfo: ExportInfo = { name: '', typeOfExport: EXPORT_TYPES[0], dimensions: [0, 0], uri: '' };
  url = '';

  @ViewChild('exportModal', { static: true }) exportModal: ElementRef;
  @ViewChild('canvasSim', { static: true }) canvasSim: ElementRef;
  @ViewChild('download', { static: true }) download: ElementRef;

  exportModalConfig: NgbModalOptions = {
    backdrop: 'static',
    size: 'sm',
    centered: true,
    keyboard: false,
  };

  constructor(private modalService: NgbModal,
              private keyboardService: KeyboardService,
              private drawingCommunicationService: DrawingCommunicationService,
              private controller: ControllerService,
              private sanitizer: DomSanitizer) {
    this.subscription = this.keyboardService.getKeyboardShortcutType().subscribe((keyboardShortcut: KeyboardShortcutType) => {
      if (keyboardShortcut === KeyboardShortcutType.ExportDrawing) {
        this.openModal();
      }
    });

    // Recupere le svg du canvas component
    this.drawingCommunicationService.canvasObservable.subscribe((data) => {
      this.exportInfo.uri = data;
    });
  }

  async export(exportName: string): Promise<void> {
    this.exportInfo.name = exportName;
    if (this.exportInfo.name.length > 0) {
      this.exportError = false;
      this.url = await this.convertXMLToExportType();
      this.sanitizer.bypassSecurityTrustUrl(this.url);
      setTimeout(() => {
        (this.download.nativeElement as HTMLButtonElement).click();
      }, 1);
      this.closeModal();
    } else {
      this.exportError = true;
    }
  }

  private async convertXMLToExportType(): Promise<string> {
    return new Promise((resolve) => {
      if (this.exportInfo.typeOfExport.id !== ExportType.SVG) {
        this.canvasElement = (this.canvasSim.nativeElement as HTMLCanvasElement);
        const context = (this.canvasElement.getContext('2d') as CanvasRenderingContext2D);
        const img = new Image();
        img.src = this.exportInfo.uri;
        this.loadImage(img).then(() => {
          context.drawImage(img, 0, 0, this.exportInfo.dimensions[0], this.exportInfo.dimensions[1]);
          resolve(this.executeConversion());
        });
      } else {
        resolve(this.exportInfo.uri);
      }
    });
  }

  private async loadImage(image: HTMLImageElement): Promise<void> {
    return new Promise((resolve) => {
      image.onload = () => resolve();
    });
  }

  private executeConversion(): string {
    if (this.exportInfo.typeOfExport.id === ExportType.BMP) {
      const canvasToBMP: CanvasToBMP = new CanvasToBMP();
      const blob = canvasToBMP.toBlob(this.canvasElement);
      return URL.createObjectURL(blob);
    } else if (this.exportInfo.typeOfExport.id === ExportType.JPG) {
      return (this.canvasElement.toDataURL('image/jpeg', 1).replace('image/jpeg', 'application/octet-stream'));
    } else if (this.exportInfo.typeOfExport.id === ExportType.PNG) {
      return (this.canvasElement.toDataURL('image/png', 1).replace('image/png', 'application/octet-stream'));
    }
    return this.exportInfo.uri;
  }

  openModal(): boolean {
    this.exportError = false;
    this.exportInfo = {
      name: 'dessin',
      typeOfExport: this.EXPORT_TYPES[0],
      dimensions: [this.controller.canvasInfo.width, this.controller.canvasInfo.height],
      uri: '',
    };
    this.drawingCommunicationService.sendSvgHtmlRequest();
    this.keyboardService.modalWindowActive = true;
    this.modalService.open(this.exportModal, this.exportModalConfig);
    return this.modalService.hasOpenModals();
  }

  closeModal(): boolean {
    this.keyboardService.modalWindowActive = false;
    this.modalService.dismissAll();
    return this.modalService.hasOpenModals();
  }

  onChangeExportType(value: string): void {
    for (const type of EXPORT_TYPES) {
      if (type.name === value) {
        this.exportInfo.typeOfExport = type;
      }
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
