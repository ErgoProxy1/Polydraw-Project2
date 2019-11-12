import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { BoundingBoxService } from 'src/app/services/boundingBoxService/bounding-box.service';
import { ControllerService } from 'src/app/services/controller/controller.service';
// import { TextTool } from 'src/app/services/tools/textTool';
import { KeyboardService } from 'src/app/services/keyboard/keyboard.service';
import { DrawingCommunicationService } from 'src/app/services/serverCommunication/drawing-communication.service';
import { SVGPrimitive } from 'src/app/services/svgPrimitives/svgPrimitive';
import { Grid } from 'src/app/services/tools/grid';
import { TextTool } from 'src/app/services/tools/textTool';
import { ToolsService } from 'src/app/services/tools/tools.service';
import { Color } from 'src/app/services/utils/color';
// tslint:disable-next-line
import { DEFAULT_CURSOR, KeyboardEventType, LEFT_MOUSE_BUTTON, MouseEventType, RIGHT_MOUSE_BUTTON, ToolType } from 'src/app/services/utils/constantsAndEnums';
import { Point } from 'src/app/services/utils/point';
import { DrawingService } from '../../services/drawing/drawing.service';
import { NewDrawingInfo } from '../../services/utils/newDrawingInfo';
import { SvgComponent } from './svg/svg.component';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss'],
})
export class CanvasComponent implements AfterViewInit, OnDestroy {

  @ViewChild('canvas', { static: false }) canvas: ElementRef;
  @ViewChild('svgPrimitives', { static: false }) htmlOfPrimitives: ElementRef;
  @ViewChild('svgPrimitivesFixe', { static: false }) fixedPrimitives: SvgComponent;
  @ViewChild('svgPrimitivesTemporaires', { static: false }) temporaryPrimitives: SvgComponent;

  newDrawingInfo: NewDrawingInfo;

  canvasWidth = 0;
  canvasHeight = 0;
  canvasBackground = 'rgba(255,255,255,1)';

  gridInfo: Grid;
  screenShoting = false;
  private gridSubscription: Subscription;
  private controllerHTMLPrimitiveSubscription: Subscription;
  private keyboardEventSubscription: Subscription;
  numberOfSquareWidth = 0;
  numberOfSquareHeight = 0;
  viewBox = '0 0 0 0';

  private wheelTrigered = false;

  constructor(private drawingService: DrawingService, private controller: ControllerService,
              private toolService: ToolsService, private keyboardService: KeyboardService,
              private drawingCommunicationService: DrawingCommunicationService,
              private boundingBoxService: BoundingBoxService) {
    this.gridInfo = new Grid();

    this.keyboardEventSubscription = this.keyboardService.getKeyboardEventType().subscribe((keyboardEventType: KeyboardEventType) => {
      this.controller.keyboardEventOnCanvas(keyboardEventType);
      this.updatePrimitives();
    });

    this.gridSubscription = this.toolService.subscribeToGrid().subscribe((grid) => {
      this.gridInfo = grid;
      this.calculateGrid();
    });

    this.controllerHTMLPrimitiveSubscription = this.controller.getPrimitivesHTMLObservable().subscribe((send) => {
      this.screenShoting = true;
      if (send) {
        this.viewBox = '0 0 ' + this.canvasWidth + ' ' + this.canvasHeight;
        setTimeout(() => { // juste pour permettre de cacher la grille avant le screenshot
          // tranformation du svg pour base64 en un image
          const serializer = new XMLSerializer();
          const data = serializer.serializeToString(this.htmlOfPrimitives.nativeElement);
          controller.sendHTMLStringOfPrimitives(
            'data:image/svg+xml;charset=utf-8;base64,' + btoa(unescape(encodeURIComponent(data))),
          );
          this.screenShoting = false;
        }, 1);
      }
    });

    this.drawingService.drawingObservable.subscribe((data) => {
      this.newDrawingInfo = data;
      this.clearCanvas();
      this.defineDimensions(this.newDrawingInfo.width, this.newDrawingInfo.height);
      this.defineBackgroundColor(this.newDrawingInfo.color);
    });

    this.drawingService.backgroundColorObservable.subscribe((data) => {
      this.defineBackgroundColor(data);
    });

    this.drawingService.initWorkspaceObservable.subscribe((data) => {
      this.defineDimensions(data[0], data[1]);
    });

    this.drawingCommunicationService.exportButtonObservable.subscribe(() => {
      this.screenShoting = true;
      this.viewBox = '0 0 ' + this.canvasWidth + ' ' + this.canvasHeight;
      setTimeout(() => {
        const serializer = new XMLSerializer();
        const data = serializer.serializeToString(this.htmlOfPrimitives.nativeElement);
        this.screenShoting = false;
        this.drawingCommunicationService.sendSvgHtml(
          'data:image/svg+xml;charset=utf-8;base64,' + btoa(unescape(encodeURIComponent(data))),
        );
      }, 1);
    });
  }

  @HostListener('wheel', ['$event']) onScroll(event: WheelEvent) {
    if (!this.wheelTrigered) {
      this.wheelTrigered = !this.wheelTrigered;
      if (this.controller.tool.type === ToolType.StampTool) {
        event.preventDefault();
      }
      this.controller.mouseWheelEventOnCanvas(Math.sign(event.deltaY));
      this.updatePrimitives();
    } else {
      this.wheelTrigered = !this.wheelTrigered;
      return;
    }
  }

  @HostListener('dblclick', ['$event']) ondblclick(event: MouseEvent): void {
    if (event.button === 0) {
      this.sendMouseEventToController(MouseEventType.MouseDblClick, event.clientX, event.clientY);
    }
  }

  @HostListener('mouseleave', ['$event']) mouseLeaveCanvas(event: MouseEvent): void {
    if (event.button === 0) {
      this.sendMouseEventToController(MouseEventType.MouseLeave, event.clientX, event.clientY);
    }
  }

  ngAfterViewInit(): void {
    this.updatePrimitives();
  }

  ngOnDestroy(): void {
    this.controllerHTMLPrimitiveSubscription.unsubscribe();
    this.gridSubscription.unsubscribe();
    this.keyboardEventSubscription.unsubscribe();
  }

  defineDimensions(width: number, height: number): void {
    if (width < 0 || height < 0) {
      throw new Error('Canvas width and height must be positive.');
    }
    this.canvasWidth = width;
    this.canvasHeight = height;
    this.controller.canvasInfo.width = this.canvasWidth;
    this.controller.canvasInfo.height = this.canvasHeight;

    if (!this.canvasWidth || !(this.canvasHeight)) {
      this.viewBox = '0 0 0 0 ';
    } else {
      this.viewBox = '0 0 ' + this.canvasWidth + ' ' + this.canvasHeight;
    }

    this.calculateGrid();
  }

  defineBackgroundColor(color: Color): void {
    if (color.rgbaTextForm === Color.TRANSPARENT_RGBA_TEXT_FORM) {
      color.changeColor(color, 0.01);
    }
    this.canvasBackground = color.rgbaTextForm;
    this.controller.canvasInfo.color = color;
  }

  mouseDownOnCanvas(event: PointerEvent, primitive?: SVGPrimitive): void {
    event.stopPropagation();
    if (this.controller.tool.type === ToolType.EyeDropper) {
      this.toolService.sendBackgroundColorToDropper(event, this.canvasBackground);
    }
    let mouseEventType = MouseEventType.InvalidEvent;
    if (event.button === LEFT_MOUSE_BUTTON) {
      mouseEventType = MouseEventType.MouseDownLeft;
    } else if (event.button === RIGHT_MOUSE_BUTTON) {
      mouseEventType = MouseEventType.MouseDownRight;
    }
    this.sendMouseEventToController(mouseEventType, event.clientX, event.clientY, primitive);
  }

  mouseMoveOnCanvas(event: PointerEvent, primitive?: SVGPrimitive): void {
    this.sendMouseEventToController(MouseEventType.MouseMove, event.clientX, event.clientY, primitive);
    this.updatePrimitives();
  }

  mouseUpOnCanvas(event: PointerEvent, primitive?: SVGPrimitive): void {
    event.stopPropagation();

    let mouseEventType = MouseEventType.InvalidEvent;
    if (event.button === LEFT_MOUSE_BUTTON) {
      mouseEventType = MouseEventType.MouseUpLeft;
    } else if (event.button === RIGHT_MOUSE_BUTTON) {
      mouseEventType = MouseEventType.MouseUpRight;
    }
    this.sendMouseEventToController(mouseEventType, event.clientX, event.clientY, primitive);
  }

  clickOnCanvas(event: MouseEvent, primitive?: SVGPrimitive): void {
    event.stopPropagation();
    let mouseEventType = MouseEventType.InvalidEvent;
    if (event.button === LEFT_MOUSE_BUTTON) {
      mouseEventType = MouseEventType.MouseClickLeft;
    } else if (event.button === RIGHT_MOUSE_BUTTON) {
      event.preventDefault();
      mouseEventType = MouseEventType.MouseClickRight;
    }
    this.sendMouseEventToController(mouseEventType, event.clientX, event.clientY, primitive);
  }

  getCursor(): string {
    return this.controller.tool ? this.controller.tool.getCursor() : DEFAULT_CURSOR;
  }

  clearCanvas(): void {
    this.controller.clearSVGElements();
  }

  private calculateGrid(): void {
    this.numberOfSquareWidth = Math.floor(this.canvasWidth / this.gridInfo.sizeOfSquare());
    this.numberOfSquareHeight = Math.floor(this.canvasHeight / this.gridInfo.sizeOfSquare());
  }

  private sendMouseEventToController(eventType: MouseEventType, clientX: number, clientY: number, primitive?: SVGPrimitive): void {
    const element: HTMLElement = (this.canvas.nativeElement as HTMLElement);
    if (element) {
      const xOffset: number = element.getBoundingClientRect().left;
      const yOffset: number = element.getBoundingClientRect().top;
      const position: Point = new Point(clientX - xOffset, clientY - yOffset);
      this.controller.mouseEventOnCanvas(eventType, position, primitive);
      this.updatePrimitives();
    }
  }

  private updatePrimitives(): void {
    this.drawingService.sendPrimitives(this.controller.primitivesToDraw);
    if (this.controller.tool) {
      if (this.controller.tool.type === ToolType.TextTool && (this.controller.tool as TextTool).typing) {
        this.boundingBoxService.updatePrimitives(this.canvas, this.fixedPrimitives.htmlOfPrimitives, this.controller.svgPrimitives);
        this.boundingBoxService.updatePrimitives(this.canvas, this.temporaryPrimitives.htmlOfPrimitives,
          this.controller.temporaryPrimitives);
        (this.controller.tool as TextTool).getCommand().updatePerimeter();
      } else if (this.controller.tool.type === ToolType.SelectorTool || this.controller.tool.type === ToolType.Eraser) {
        // Si l'outil selectionne est le selecteur ou l'efface, on met a jour les coins des primitives pour lesquelles
        // ce n'est pas deja fait
        this.boundingBoxService.updatePrimitives(this.canvas, this.fixedPrimitives.htmlOfPrimitives, this.controller.svgPrimitives);
      }
    }
  }
}
