import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { ControllerService } from 'src/app/services/controller/controller.service';
import { SVGPrimitive } from 'src/app/services/svgPrimitives/svgPrimitive';
import { Color } from 'src/app/services/utils/color';
import { PrimitiveType, Texture } from 'src/app/services/utils/constantsAndEnums';
import { Point } from 'src/app/services/utils/point';
import { DrawingService } from '../../services/drawing/drawing.service';
import { NewDrawingInfo } from '../../services/utils/newDrawingInfo';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss'],
})
export class CanvasComponent implements AfterViewInit {
  private isMouseDown = false;
  primitives: SVGPrimitive[] = [];
  filterIds: string[] = ['basic', 'degraded', 'grayed', 'light', 'frothy'];

  @ViewChild('canvas', { static: false }) canvas: ElementRef;

  newDrawingInfo: NewDrawingInfo;

  canvasWidth: number;
  canvasHeight: number;
  canvasBackground: string;

  PrimitiveType = PrimitiveType;
  Texture = Texture;

  constructor(private drawingService: DrawingService, private controller: ControllerService) {
    this.drawingService.drawingObserver.subscribe((data) => {
      this.newDrawingInfo = data;
      this.clearCanvas();
      this.defineDimensions(this.newDrawingInfo.width, this.newDrawingInfo.height);
      this.defineBackgroundColor(this.newDrawingInfo.color);
    });
    this.drawingService.backgroundColorObserver.subscribe((data) => {
      this.defineBackgroundColor(data);
    });
    this.drawingService.initWorkspaceObserver.subscribe((data) => {
      this.defineDimensions(data[0], data[1]);
    });
  }

  @HostListener('pointermove', ['$event']) onMouseMove(event: PointerEvent) {
    if (this.isMouseDown) {
      const element: HTMLElement = (this.canvas.nativeElement as HTMLElement);
      if (element) {
        const xOffset: number = element.getBoundingClientRect().left;
        const yOffset: number = element.getBoundingClientRect().top;
        this.controller.mouseDragOnCanvas(new Point(event.clientX - xOffset, event.clientY - yOffset));
        this.primitives = this.controller.getPrimitivesToPaint();
      }
    }
  }

  @HostListener('pointerup', ['$event']) onMouseUp(event: PointerEvent) {
    if (event.button === 0) {
      this.isMouseDown = false;
      const element: HTMLElement = (this.canvas.nativeElement as HTMLElement);
      if (element) {
        element.releasePointerCapture(event.pointerId);
        const xOffset: number = element.getBoundingClientRect().left;
        const yOffset: number = element.getBoundingClientRect().top;
        this.controller.mouseUpOnCanvas(new Point(event.clientX - xOffset, event.clientY - yOffset));
      }
      this.primitives = this.controller.getPrimitivesToPaint();
    }
  }

  @HostListener('pointerdown', ['$event']) onMouseDown(event: PointerEvent) {
    if (event.button === 0) {
      this.isMouseDown = true;
      const element: HTMLElement = (this.canvas.nativeElement as HTMLElement);
      if (element) {
        element.setPointerCapture(event.pointerId);
        const xOffset: number = element.getBoundingClientRect().left;
        const yOffset: number = element.getBoundingClientRect().top;
        this.controller.mouseDownOnCanvas(new Point(event.clientX - xOffset, event.clientY - yOffset));
      }
      this.primitives = this.controller.getPrimitivesToPaint();

    }
  }

  @HostListener('window:keydown', ['$event']) onKeyDown(event: KeyboardEvent) {
    this.controller.keyDownOnCanvas(event.key);
    this.primitives = this.controller.getPrimitivesToPaint();
  }

  @HostListener('window:keyup', ['$event']) onKeyUp(event: KeyboardEvent) {
    this.controller.keyUpOnCanvas(event.key);
    this.primitives = this.controller.getPrimitivesToPaint();
  }

  @HostListener('click', ['$event']) onClick(event: MouseEvent) {
    this.drawingService.sendPrimitives(this.primitives);
  }
  @HostListener('contextmenu', ['$event']) onRightClick(event: MouseEvent) {
    event.preventDefault();
  }

  ngAfterViewInit() {
    this.drawingService.sendPrimitives(this.primitives);
  }

  defineDimensions(width: number, height: number): void {
    if (width < 0 || height < 0) {
      throw new Error('Canvas width and height must be positive.');
    }
    this.canvasWidth = width;
    this.canvasHeight = height;
  }

  defineBackgroundColor(color: Color): void {
    this.canvasBackground = color.asString();
  }

  primitiveLeftClicked(event: MouseEvent, primitive: SVGPrimitive): void {
    if (event.button === 0) {
      this.controller.selectPrimitive(true, primitive);
    }
  }

  primitiveRightClicked(event: MouseEvent, primitive: SVGPrimitive): void {
    if (event.button === 2) {
      this.controller.selectPrimitive(false, primitive);
    }
  }

  clearCanvas(): void {
    this.primitives.length = 0;
    this.controller.clearSVGElements();
  }
}
