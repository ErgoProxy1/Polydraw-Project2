import { Injectable, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { SVGPrimitive } from '../svgPrimitives/svgPrimitive';
import { ToolCommand } from '../toolCommands/toolCommand';
import { Tool } from '../tools/tool';
import { ToolsService } from '../tools/tools.service';
import { ToolType } from '../utils/constantsAndEnums';
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

  constructor(private toolsService: ToolsService) {
    this.selectedToolSubscription = this.toolsService.subscribeToToolChanged().subscribe( (toolSelected) => {
      this.tool = toolSelected;
    });
  }

  ngOnDestroy() {
    this.selectedToolSubscription.unsubscribe();
  }

  mouseDownOnCanvas(position: Point): void {
    if (this.tool && this.tool.type !== ToolType.ColorApplicator) {
      this.temporaryPrimitives = this.tool.begin(position);
    }
  }

  mouseDragOnCanvas(position: Point): void {
    if (this.tool && this.tool.type !== ToolType.ColorApplicator) {
      this.temporaryPrimitives = this.tool.update(position);
    }
  }

  mouseUpOnCanvas(position: Point): void {
    if (this.tool && this.tool.type !== ToolType.ColorApplicator) {
      const command: ToolCommand = this.tool.finish(position);
      const primitive: SVGPrimitive | null = command.apply();
      if (primitive) {
        this.svgPrimitives.push(primitive);
      }
      this.executedCommands.push(command);
      this.temporaryPrimitives = [];
      this.cancelledCommands = [];
    }
  }

  keyDownOnCanvas(key: string): void {
    if (this.tool && this.tool.type !== ToolType.ColorApplicator) {
      this.temporaryPrimitives = this.tool.keyDown(key);
    }
  }

  keyUpOnCanvas(key: string): void {
    if (this.tool && this.tool.type !== ToolType.ColorApplicator) {
      this.temporaryPrimitives = this.tool.keyUp(key);
    }
  }

  selectPrimitive(isLeftClicked: boolean, primitive: SVGPrimitive ): void {
    if (this.tool && this.tool.type === ToolType.ColorApplicator) {
      const command: ToolCommand =  this.tool.finish(new Point(0, 0), isLeftClicked, primitive);
      this.executedCommands.push(command);
    }
  }

  getPrimitivesToPaint(): SVGPrimitive[] {
    return this.svgPrimitives.concat(this.temporaryPrimitives);
  }

  cancel(): void {
    const cancelledCommand = this.executedCommands.pop();
    if (cancelledCommand) {
      this.cancelledCommands.push(cancelledCommand);
      cancelledCommand.cancel();
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
    }
  }

  clearSVGElements(): void {
    this.svgPrimitives.length = 0;
    this.temporaryPrimitives.length = 0;
  }

}
