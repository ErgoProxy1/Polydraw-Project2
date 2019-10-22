import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { ControllerService } from 'src/app/services/controller/controller.service';
import { Perimeter } from 'src/app/services/svgPrimitives/rectangle/perimeter/perimeter';
import { SVGPrimitive } from 'src/app/services/svgPrimitives/svgPrimitive';
import { Grid } from 'src/app/services/tools/grid';
import { StampTool } from 'src/app/services/tools/stampTool';
import { ToolsService } from 'src/app/services/tools/tools.service';
import { Color } from 'src/app/services/utils/color';
// tslint:disable-next-line
import { KeyboardEventType, LEFT_MOUSE_BUTTON, MouseEventType, PrimitiveType, RIGHT_MOUSE_BUTTON, Texture, ToolType } from 'src/app/services/utils/constantsAndEnums';
import { Point } from 'src/app/services/utils/point';
import { DefaultStamps, StampInfo } from 'src/app/services/utils/stampData';
import { DrawingService } from '../../services/drawing/drawing.service';
import { NewDrawingInfo } from '../../services/utils/newDrawingInfo';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss'],
})
export class CanvasComponent implements AfterViewInit, OnDestroy {

  readonly FILTER_IDS: string[] = ['basic', 'degraded', 'grayed', 'light', 'frothy'];
  readonly STAMPS: StampInfo[] = DefaultStamps;
  readonly PATTERN_TYPE: string[] = ['3', '', '4 2 3', '2 1', '5 1 2', '3 0.5 0.5 0.5'];
  readonly LINE_JOIN_TYPE: string[] = ['arcs', 'bevel', 'miter', 'miter-clip', 'Point', 'Round'];
  readonly LINE_CAP_TYPE: string[] = ['butt', 'round', 'square'];
  cursor = 'default';

  @ViewChild('canvas', { static: false }) canvas: ElementRef;
  @ViewChild('svgPrimitives', { static: false }) htmlOfPrimitives: ElementRef;

  newDrawingInfo: NewDrawingInfo;

  canvasWidth = 0 ;
  canvasHeight = 0;
  canvasBackground = 'rgba(255,255,255,1)';

  PrimitiveType = PrimitiveType;
  Texture = Texture;

  gridInfo: Grid;
  screenShoting = false;
  private gridSubscription: Subscription;
  private controllerHTMLPrimitiveSubscription: Subscription;
  numberOfSquareWidth = 0;
  numberOfSquareHeight = 0;
  viewBox = '0 0 0 0';

  private wheelTrigered = false;

  aargh: Perimeter[] = [];
  constructor(private drawingService: DrawingService, private controller: ControllerService, private toolService: ToolsService) {
    this.gridInfo = new Grid();

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
          controller.sendHTMLStringOfPrimitives('data:image/svg+xml;base64,' + btoa(data));
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
  }

  @HostListener('window:keydown', ['$event']) onKeyDown(event: KeyboardEvent) {
    this.controller.keyboardEventOnCanvas(KeyboardEventType.KeyDown, event.key);
    this.updatePrimitives();
  }

  @HostListener('window:keyup', ['$event']) onKeyUp(event: KeyboardEvent) {
    this.controller.keyboardEventOnCanvas(KeyboardEventType.KeyUp, event.key);
    this.updatePrimitives();
  }
  @HostListener('wheel', ['$event']) onScroll(event: WheelEvent) {
    if (!this.wheelTrigered) {
      this.wheelTrigered = true;
      if (this.controller.tool.type === ToolType.StampTool) {
        event.preventDefault();
      }
      this.controller.mouseWheelEventOnCanvas(Math.sign(event.deltaY));
      this.updatePrimitives();
    } else {
      this.wheelTrigered = false;
      return;
    }
  }

  @HostListener('dblclick', ['$event']) ondblclick(event: MouseEvent) {
    if (event.button === 0) {
      this.sendMouseEventToController(MouseEventType.MouseDblClick, event.clientX, event.clientY);
    }
  }

  ngAfterViewInit() {
    this.updatePrimitives();
  }

  ngOnDestroy(): void {
    this.controllerHTMLPrimitiveSubscription.unsubscribe();
    this.gridSubscription.unsubscribe();
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
    if (color.rgbaTextForm === 'none') {
      color.changeColor(color, 0.01);
    }
    this.canvasBackground = color.rgbaTextForm;
    this.controller.canvasInfo.color = color;
  }

  mouseDownOnCanvas(event: PointerEvent, primitive?: SVGPrimitive) {
    event.stopPropagation();
    if (this.controller.tool.type === ToolType.EyeDropper) {
      const colorValues: string[] = this.canvasBackground.split('rgba(')[1].split(',');

      const backgroundColor: Color = new Color(Number(colorValues[0]),
        Number(colorValues[1]),
        Number(colorValues[2]),
        Number(colorValues[3].split(')')[0]));

      if (event.button === LEFT_MOUSE_BUTTON) {
        this.toolService.sendPrimaryToColorTool(backgroundColor);
      } else if (event.button === RIGHT_MOUSE_BUTTON) {
        this.toolService.sendSecondaryToColorTool(backgroundColor);
      }
    }
    const element: HTMLElement = (this.canvas.nativeElement as HTMLElement);
    if (element && event.pointerId) {
      element.releasePointerCapture(event.pointerId);
    }

    let mouseEventType = MouseEventType.InvalidEvent;
    if (event.button === LEFT_MOUSE_BUTTON) {
      mouseEventType = MouseEventType.MouseDownLeft;
    } else if (event.button === RIGHT_MOUSE_BUTTON) {
      mouseEventType = MouseEventType.MouseDownRight;
    }
    this.sendMouseEventToController(mouseEventType, event.clientX, event.clientY, primitive);
  }

  mouseMoveOnCanvas(event: PointerEvent, primitive?: SVGPrimitive) {
    this.switchCursor();
    this.sendMouseEventToController(MouseEventType.MouseMove, event.clientX, event.clientY, primitive);
  }

  mouseUpOnCanvas(event: PointerEvent, primitive?: SVGPrimitive) {
    event.stopPropagation();
    const element: HTMLElement = (this.canvas.nativeElement as HTMLElement);
    if (element && event.pointerId) {
      element.releasePointerCapture(event.pointerId);
    }

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

  switchCursor() {
    if (this.controller.tool) {
      if (this.controller.tool.type === ToolType.StampTool) {
        if ((this.controller.tool as StampTool).selected !== 0) { this.cursor = 'none'; } else { this.cursor = 'default'; }
      } else if (this.controller.tool.type === ToolType.Line) {
        this.cursor = 'crosshair';
      } else {
        this.cursor = 'default';
      }
    }
  }

  clearCanvas(): void {
    this.controller.clearSVGElements();
  }

  getPrimitives(): SVGPrimitive[] {
    return this.controller.primitivesToDraw;
  }

  private setBoundingBoxOfPrimitive(element: SVGGraphicsElement, primitive: SVGPrimitive) {
    const canvasElement: HTMLElement = (this.canvas.nativeElement as HTMLElement);
    if (canvasElement && element && primitive && !primitive.areCornersSet) {
      const xOffset: number = canvasElement.getBoundingClientRect().left;
      const yOffset: number = canvasElement.getBoundingClientRect().top;
      const bbox: DOMRect = element.getBoundingClientRect() as DOMRect;
      const topLeftCorner = new Point(bbox.x - xOffset, bbox.y - yOffset);
      const bottomRightCorner = new Point(bbox.x + bbox.width - xOffset, bbox.y + bbox.height - yOffset);
      primitive.setCorners(topLeftCorner, bottomRightCorner);
    }
  }

  private sendMouseEventToController(eventType: MouseEventType, clientX: number, clientY: number, primitive?: SVGPrimitive) {
    const element: HTMLElement = (this.canvas.nativeElement as HTMLElement);
    if (element) {
      const xOffset: number = element.getBoundingClientRect().left;
      const yOffset: number = element.getBoundingClientRect().top;
      const position: Point = new Point(clientX - xOffset, clientY - yOffset);
      this.controller.mouseEventOnCanvas(eventType, position, primitive);
      this.updatePrimitives();
    }
  }

  private updatePrimitives() {
    this.drawingService.sendPrimitives(this.controller.primitivesToDraw);
    const canvasElement: HTMLElement = (this.htmlOfPrimitives.nativeElement as HTMLElement);
    // Si l'outil selectionne est le selecteur, on met a jour les coins des primitives pour lesquelles ce n'est pas deja fait
    if (this.controller.tool && this.controller.tool.type === ToolType.SelectorTool && canvasElement) {
      const svgElements: HTMLCollection = (canvasElement as HTMLElement).children; // les elements HTML des primitives SVG
      let i = this.gridInfo.toShow && !this.screenShoting ? 1 : 0; // si la grille est affichee, commencer par le deuxieme element
      for (let j = 0; i < svgElements.length && j < this.controller.primitivesToDraw.length; i++, j++) {
        const svgElement: SVGGraphicsElement = svgElements.item(i) as SVGGraphicsElement;
        if (svgElement) {
          this.setBoundingBoxOfPrimitive(svgElement, this.controller.primitivesToDraw[j]);
        }
      }
    }
  }

  private calculateGrid() {
    this.numberOfSquareWidth = Math.floor(this.canvasWidth / this.gridInfo.sizeOfSquare());
    this.numberOfSquareHeight = Math.floor(this.canvasHeight / this.gridInfo.sizeOfSquare());
  }
}
