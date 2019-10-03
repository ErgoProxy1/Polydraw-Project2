import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ColorApplicatorTool } from '../tools/colorApplicatorTool';
import { PaintBrushTool } from '../tools/paintBrushTool';
import { PencilTool } from '../tools/pencilTool';
import { RectangleTool } from '../tools/rectangleTool';
import { Tool } from '../tools/tool';
import { Color } from '../utils/color';
import { ToolType } from '../utils/constantsAndEnums';

@Injectable({
  providedIn: 'root',
})
export class ToolsService {
  private paintBrush: Tool;
  private rectangle: Tool;
  private pencil: Tool;
  private colorApplicator: Tool;
  private selectedTool: Subject<Tool>;
  primaryColor: Color = new Color(0, 0, 0);
  secondaryColor: Color = new Color(255, 255, 255);

  constructor() {
    this.paintBrush = new PaintBrushTool(this.primaryColor);
    this.rectangle = new RectangleTool(this.primaryColor, this.secondaryColor);
    this.pencil = new PencilTool(this.primaryColor);
    this.colorApplicator = new ColorApplicatorTool(this.primaryColor, this.secondaryColor);
    this.selectedTool = new Subject<Tool>();
  }

  newToolSelected(toolType: ToolType): void {
    switch (toolType) {
      case ToolType.RectangleTool:
        this.selectedTool.next(this.rectangle);
        break;
      case ToolType.PaintBrushTool:
        this.selectedTool.next(this.paintBrush);
        break;
      case ToolType.Pencil:
        this.selectedTool.next(this.pencil);
        break;
      case ToolType.ColorApplicator:
        this.selectedTool.next(this.colorApplicator);
        break;
      default:
        this.selectedTool.next();
        break;
    }
  }

  subscribeToToolChanged(): Observable<Tool> {
    return this.selectedTool.asObservable();
  }

}
