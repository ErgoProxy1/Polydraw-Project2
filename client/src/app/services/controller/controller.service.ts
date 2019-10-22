import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { DrawingService } from '../drawing/drawing.service';
import { SVGPrimitive } from '../svgPrimitives/svgPrimitive';
import { ToolCommand } from '../toolCommands/toolCommand';
import { SelectorTool } from '../tools/selectorTool';
import { Tool } from '../tools/tool';
import { ToolsService } from '../tools/tools.service';
import { Color } from '../utils/color';
import { KeyboardEventType, MouseEventType, ToolType } from '../utils/constantsAndEnums';
import { NewDrawingInfo } from '../utils/newDrawingInfo';
import { Point } from '../utils/point';

@Injectable({
  providedIn: 'root',
})
export class ControllerService implements OnDestroy {
  private selectedToolSubscription: Subscription;
  tool: Tool;
  private svgPrimitives: SVGPrimitive[] = [];
  private temporaryPrimitives: SVGPrimitive[] = [];
  private executedCommands: ToolCommand[] = [];
  private cancelledCommands: ToolCommand[] = [];
  primitivesToDraw: SVGPrimitive[] = [];

  canvasInfo: NewDrawingInfo;
  newDrawingSubcription: Subscription;
  newBackgroundColorSubscription: Subscription;
  private primitivesHTMLSubject = new Subject<boolean>();
  private primitivesHTMLSubjectString = new Subject<string>();

  constructor(private toolsService: ToolsService, private drawingService: DrawingService) {
    this.canvasInfo = new NewDrawingInfo(0, 0, new Color(0, 0, 0, 0));
    this.selectedToolSubscription = this.toolsService.subscribeToToolChanged().subscribe((toolSelected) => {
      this.tool = toolSelected;
      if (this.tool && this.tool.type === ToolType.SelectorTool) {
        (this.tool as SelectorTool).updatePrimitivesList(this.svgPrimitives);
      }
      this.temporaryPrimitives.length = 0;
      this.updatePrimitivesToDraw();
    });

    this.newDrawingSubcription = this.drawingService.drawingObservable.subscribe((newDrawing: NewDrawingInfo) => {
      this.canvasInfo = newDrawing;
    });

    this.newBackgroundColorSubscription = this.drawingService.backgroundColorObservable.subscribe((newColor: Color) => {
      this.canvasInfo.color = Color.copyColor(newColor);
    });
  }

  ngOnDestroy() {
    this.selectedToolSubscription.unsubscribe();
    this.newDrawingSubcription.unsubscribe();
    this.newBackgroundColorSubscription.unsubscribe();
  }

  mouseEventOnCanvas(eventType: MouseEventType, position: Point, primitive?: SVGPrimitive): void {
    if (this.tool) {
      this.temporaryPrimitives = this.tool.mouseEvent(eventType, position, primitive);
      this.applyCommandIfToolHasFinished();
      this.updatePrimitivesToDraw();
    }
  }

  keyboardEventOnCanvas(eventType: KeyboardEventType, key: string): void {
    if (this.tool) {
      this.temporaryPrimitives = this.tool.keyboardEvent(eventType, key);
      this.applyCommandIfToolHasFinished();
      this.updatePrimitivesToDraw();
    }
  }

  mouseWheelEventOnCanvas(delta: number): void {
    if (this.tool) {
      this.temporaryPrimitives = this.tool.mouseWheelEvent(delta);
      this.applyCommandIfToolHasFinished();
      this.updatePrimitivesToDraw();
    }
  }

  private applyCommandIfToolHasFinished(): void {
    if (this.tool && this.tool.isCommandReady()) {
      const command: ToolCommand | null = this.tool.getCommand();
      if (command) {
        const primitive: SVGPrimitive | null = command.apply();
        if (primitive) {
          this.svgPrimitives.push(primitive);
        }
        this.executedCommands.push(command);
        this.temporaryPrimitives.length = 0;
        this.cancelledCommands.length = 0;
      }
    }
  }

  cancel(): void {
    const cancelledCommand = this.executedCommands.pop();
    if (cancelledCommand) {
      this.cancelledCommands.push(cancelledCommand);
      cancelledCommand.cancel();
      this.updatePrimitivesToDraw();
    }
  }

  executeLastCancelledCommand(): void {
    const lastCancelledCommand: ToolCommand | undefined = this.cancelledCommands.pop();
    if (lastCancelledCommand) {
      this.executedCommands.push(lastCancelledCommand);
      const primitive: SVGPrimitive | null = lastCancelledCommand.apply();
      if (primitive) {
        this.svgPrimitives.push(primitive);
      }
      this.updatePrimitivesToDraw();
    }
  }

  clearSVGElements(): void {
    this.svgPrimitives.length = 0;
    this.temporaryPrimitives.length = 0;
    this.primitivesToDraw.length = 0;
  }

  private updatePrimitivesToDraw(): void {
    this.primitivesToDraw = this.svgPrimitives.concat(this.temporaryPrimitives);
  }

  getPrimitives(): SVGPrimitive[] {
    return this.svgPrimitives;
  }

  setPrimitives(primitives: SVGPrimitive[]) {
    this.svgPrimitives = primitives;
    if (this.tool && this.tool.type === ToolType.SelectorTool) {
      (this.tool as SelectorTool).updatePrimitivesList(this.svgPrimitives);
    }
    this.updatePrimitivesToDraw();
  }

  setCanvasInfo(canvasInfo: NewDrawingInfo) {
    this.canvasInfo = canvasInfo;
    this.drawingService.sendDrawingData(canvasInfo);
  }

  isEmptyPrimitives(): boolean {
    return this.svgPrimitives.length === 0;
  }

  getPrimitivesHTMLObservable(): Observable<boolean> {
    return this.primitivesHTMLSubject.asObservable();
  }
  getHTMLOfPrimitives() {
    this.primitivesHTMLSubject.next(true);
  }

  getHTMLPrimitivesStringObservable(): Observable<string> {
    return this.primitivesHTMLSubjectString.asObservable();
  }

  sendHTMLStringOfPrimitives(htmlPrimitives: string) {
    this.primitivesHTMLSubjectString.next(htmlPrimitives);
  }
}
