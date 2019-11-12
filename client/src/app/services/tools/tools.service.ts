import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ClipboardService } from '../clipboard/clipboard.service';
import { KeyboardService } from '../keyboard/keyboard.service';
import { ColorApplicatorTool } from '../tools/colorApplicatorTool';
import { LineTool } from '../tools/lineTool';
import { PaintBrushTool } from '../tools/paintBrushTool';
import { PencilTool } from '../tools/pencilTool';
import { PenTool } from '../tools/penTool';
import { RectangleTool } from '../tools/rectangleTool';
import { Tool } from '../tools/tool';
import { Color } from '../utils/color';
import { KeyboardShortcutType, LEFT_MOUSE_BUTTON, RIGHT_MOUSE_BUTTON, ToolType } from '../utils/constantsAndEnums';
import { EllipseTool } from './ellipseTool';
import { EraserTool } from './eraserTool';
import { EyeDropperTool } from './eyeDropperTool';
import { Grid } from './grid';
import { PolygonTool } from './polygonTool';
import { SelectorTool } from './selectorTool';
import { StampTool } from './stampTool';
import { TextTool } from './textTool';

@Injectable({
  providedIn: 'root',
})

export class ToolsService {
  private selectedTool: Subject<Tool>;
  private currentShapeToolTypeSelected: ToolType = ToolType.RectangleTool;
  primaryColor: Color = new Color(0, 0, 0);
  secondaryColor: Color = new Color(255, 255, 255);

  eyeDropperPrimaryObservable: Observable<Color>;
  private eyeDropperPrimarySubject = new Subject<Color>();

  eyeDropperSecondaryObservable: Observable<Color>;
  private eyeDropperSecondarySubject = new Subject<Color>();

  selectorObservable: Observable<boolean>;
  selectorSubject: Subject<boolean> = new Subject<boolean>();
  selectorInUse = false;

  private gridSubject: Subject<Grid>;
  gridInfo: Grid;
  readonly tools: Map<ToolType, Tool>;

  constructor(private keyboardService: KeyboardService, private clipboardService: ClipboardService) {
    this.tools = new Map<ToolType, Tool>([
      [ToolType.PaintBrushTool, new PaintBrushTool(this.primaryColor)],
      [ToolType.RectangleTool, new RectangleTool(this.primaryColor, this.secondaryColor)],
      [ToolType.Pencil, new PencilTool(this.primaryColor)],
      [ToolType.Line, new LineTool(this.primaryColor)],
      [ToolType.ColorApplicator, new ColorApplicatorTool(this.primaryColor, this.secondaryColor)],
      [ToolType.StampTool, new StampTool()],
      [ToolType.EyeDropper, new EyeDropperTool()],
      [ToolType.EllipseTool, new EllipseTool(this.primaryColor, this.secondaryColor)],
      [ToolType.Pen, new PenTool(this.primaryColor)],
      [ToolType.ColorApplicator, new ColorApplicatorTool(this.primaryColor, this.secondaryColor)],
      [ToolType.StampTool, new StampTool()],
      [ToolType.EyeDropper, new EyeDropperTool()],
      [ToolType.PolygonTool, new PolygonTool(this.primaryColor, this.secondaryColor)],
      [ToolType.SelectorTool, new SelectorTool(this.clipboardService)],
      [ToolType.GridTool, new Grid()],
      [ToolType.Eraser, new EraserTool()],
      [ToolType.TextTool, new TextTool(this.primaryColor, keyboardService)],
    ]);
    this.selectedTool = new Subject<Tool>();
    this.eyeDropperPrimaryObservable = this.eyeDropperPrimarySubject.asObservable();
    this.eyeDropperSecondaryObservable = this.eyeDropperSecondarySubject.asObservable();
    this.selectorObservable = this.selectorSubject.asObservable();

    this.gridInfo = new Grid();
    this.gridSubject = new Subject<Grid>();

    this.keyboardService.getKeyboardShortcutType().subscribe((key: KeyboardShortcutType) => {
      if (key === KeyboardShortcutType.Grid) {
        this.showGrid(!this.gridInfo.toShow);
      } else if (key === KeyboardShortcutType.ZoomInGrid) {
        this.gridInfo.sizeOfSquare(this.gridInfo.sizeOfSquare() + (5 - this.gridInfo.sizeOfSquare() % 5));
      } else if (key === KeyboardShortcutType.ZoomOutGrid) {
        this.gridInfo.sizeOfSquare(this.gridInfo.sizeOfSquare() - (5 - this.gridInfo.sizeOfSquare() % 5));
      }
    });
  }

  newToolSelected(toolType: ToolType): void {
    if (this.tools.has(toolType)) {
      this.selectedTool.next(this.tools.get(toolType));
      if (toolType === ToolType.RectangleTool || toolType === ToolType.EllipseTool || toolType === ToolType.PolygonTool) {
        this.currentShapeToolTypeSelected = toolType;
      }
    } else if (toolType === ToolType.GridTool || toolType === ToolType.None) {
      this.selectedTool.next();
    }
  }

  subscribeToToolChanged(): Observable<Tool> {
    return this.selectedTool.asObservable();
  }

  sendBackgroundColorToDropper(event: PointerEvent, background: string): void {
    const colorValues: string[] = background.split('rgba(')[1].split(',');
    const backgroundColor: Color = new Color(Number(colorValues[0]),
      Number(colorValues[1]),
      Number(colorValues[2]),
      Number(colorValues[3].split(')')[0]));
    if (event.button === LEFT_MOUSE_BUTTON) {
      this.sendPrimaryToColorTool(backgroundColor);
    } else if (event.button === RIGHT_MOUSE_BUTTON) {
      this.sendSecondaryToColorTool(backgroundColor);
    }
  }

  sendPrimaryToColorTool(color: Color): void {
    this.eyeDropperPrimarySubject.next(color);
  }

  sendSecondaryToColorTool(color: Color): void {
    this.eyeDropperSecondarySubject.next(color);
  }

  changeGridProperties(sizeOfSquare: number, transparency: number): void {
    this.gridInfo.sizeOfSquare(sizeOfSquare);
    this.gridInfo.changeTransparency(transparency);
    this.gridSubject.next(this.gridInfo);
  }

  showGrid(show: boolean): void {
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
