import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { KeyboardShortcutService } from '../keyboardShortcut/keyboard-shortcut.service';
import { ColorApplicatorTool } from '../tools/colorApplicatorTool';
import { LineTool } from '../tools/lineTool';
import { PaintBrushTool } from '../tools/paintBrushTool';
import { PencilTool } from '../tools/pencilTool';
import { RectangleTool } from '../tools/rectangleTool';
import { Tool } from '../tools/tool';
import { Color } from '../utils/color';
import { KeyboardShortcutType, ToolType } from '../utils/constantsAndEnums';
import { EllipseTool } from './ellipseTool';
import { EyeDropperTool } from './eyeDropperTool';
import { Grid } from './grid';
import { PolygonTool } from './polygonTool';
import { SelectorTool } from './selectorTool';
import { StampTool } from './stampTool';

@Injectable({
  providedIn: 'root',
})
export class ToolsService {
  private selectedTool: Subject<Tool>;
  private currentShapeToolTypeSelected: ToolType = ToolType.RectangleTool;
  primaryColor: Color = new Color(0, 0, 0);
  secondaryColor: Color = new Color(255, 255, 255);

  eyeDropperPrimaryObservable: Observable<Color>;
  eyeDropperPrimarySubject = new Subject<Color>();

  eyeDropperSecondaryObservable: Observable<Color>;
  eyeDropperSecondarySubject = new Subject<Color>();

  private gridSubject: Subject<Grid>;
  gridInfo: Grid;
  readonly tools: Map<ToolType, Tool>;

  constructor(private keyoardshortcu: KeyboardShortcutService) {
    this.tools = new Map<ToolType, Tool>([
      [ToolType.PaintBrushTool, new PaintBrushTool(this.primaryColor)],
      [ToolType.RectangleTool, new RectangleTool(this.primaryColor, this.secondaryColor)],
      [ToolType.Pencil, new PencilTool(this.primaryColor)],
      [ToolType.Line, new LineTool(this.primaryColor)],
      [ToolType.ColorApplicator, new ColorApplicatorTool(this.primaryColor, this.secondaryColor)],
      [ToolType.StampTool, new StampTool()],
      [ToolType.EyeDropper, new EyeDropperTool()],
      [ToolType.EllipseTool, new EllipseTool(this.primaryColor, this.secondaryColor)],
      [ToolType.PolygonTool, new PolygonTool(this.primaryColor, this.secondaryColor)],
      [ToolType.SelectorTool, new SelectorTool()],
      [ToolType.GridTool, new Grid()],
    ]);
    this.selectedTool = new Subject<Tool>();
    this.eyeDropperPrimaryObservable = this.eyeDropperPrimarySubject.asObservable();
    this.eyeDropperSecondaryObservable = this.eyeDropperSecondarySubject.asObservable();

    this.gridInfo = new Grid();
    this.gridSubject = new Subject<Grid>();

    this.keyoardshortcu.subject.subscribe( (key: KeyboardShortcutType) => {
      if (key === KeyboardShortcutType.Grid) {
        this.showGrid(! this.gridInfo.toShow);
      } else if (key === KeyboardShortcutType.ZoomInGrid) {
        this.gridInfo.sizeOfSquare(this.gridInfo.sizeOfSquare() + (5 - this.gridInfo.sizeOfSquare()  % 5));
      } else if (key === KeyboardShortcutType.ZoomOutGrid) {
        this.gridInfo.sizeOfSquare(this.gridInfo.sizeOfSquare() - (5 - this.gridInfo.sizeOfSquare()  % 5));
      }
    });
  }

  newToolSelected(toolType: ToolType): void {
    if (this.tools.has(toolType)) {
      this.selectedTool.next(this.tools.get(toolType));
      if (toolType === ToolType.RectangleTool || toolType === ToolType.EllipseTool
         || toolType === ToolType.PolygonTool) {
        this.currentShapeToolTypeSelected = toolType;
      }
    } else if (toolType === ToolType.GridTool || toolType === ToolType.None) {
      this.selectedTool.next();
    }
  }

  subscribeToToolChanged(): Observable<Tool> {
    return this.selectedTool.asObservable();
  }

  sendPrimaryToColorTool(color: Color) {
    this.eyeDropperPrimarySubject.next(color);
  }

  sendSecondaryToColorTool(color: Color) {
    this.eyeDropperSecondarySubject.next(color);
  }

  changeGridProperties(sizeOfSquare: number, transparency: number) {
    this.gridInfo.sizeOfSquare(sizeOfSquare);
    this.gridInfo.changeTransparency(transparency);
    this.gridSubject.next(this.gridInfo);
  }

  showGrid(show: boolean) {
    this.gridInfo.toShow = show;
    this.gridSubject.next(this.gridInfo);
  }

  subscribeToGrid(): Observable<Grid> {
    return this.gridSubject.asObservable();
  }

  getCurrentShapeToolTypeSelected(): ToolType {
    return this.currentShapeToolTypeSelected;
  }
}
