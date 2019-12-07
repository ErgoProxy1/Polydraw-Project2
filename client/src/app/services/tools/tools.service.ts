import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { BoundingBoxService } from '../boundingBoxService/bounding-box.service';
import { ClipboardService } from '../clipboard/clipboard.service';
import { KeyboardService } from '../keyboard/keyboard.service';
import { MessageHandlerService } from '../messageHandler/message-handler.service';
import { MoveService } from '../move/move.service';
import { ResizeService } from '../resize/resize.service';
import { RotationService } from '../rotation/rotation.service';
import { DrawingCommunicationService } from '../serverCommunication/drawing-communication.service';
import { ColorApplicatorTool } from '../tools/colorApplicatorTool';
import { LineTool } from '../tools/lineTool';
import { PaintBrushTool } from '../tools/paintBrushTool';
import { PencilTool } from '../tools/pencilTool';
import { PenTool } from '../tools/penTool';
import { RectangleTool } from '../tools/rectangleTool';
import { SpraypaintTool } from '../tools/spraypaintTool';
import { Tool } from '../tools/tool';
import { Color } from '../utils/color';
import { DEFAULT_SPRAYPAINT_DELAY, DEFAULT_SPRAYPAINT_RANGE, KeyboardShortcutType, LEFT_MOUSE_BUTTON,
  RIGHT_MOUSE_BUTTON, ToolType } from '../utils/constantsAndEnums';
import { EllipseTool } from './ellipseTool';
import { EraserTool } from './eraserTool';
import { EyeDropperTool } from './eyeDropperTool';
import { Grid } from './grid';
import { PaintBucketTool } from './paintBucketTool';
import { PolygonTool } from './polygonTool';
import { QuillTool } from './quillTool';
import { SelectorTool } from './selectorTool';
import { StampTool } from './stampTool';
import { TextTool } from './textTool';

@Injectable({
  providedIn: 'root',
})

export class ToolsService {
  private selectedTool: Subject<Tool>;
  private currentShapeToolTypeSelected: ToolType = ToolType.RectangleTool;
  private currentBucketToolTypeSelected: ToolType = ToolType.PaintBucket;
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
  readonly TOOLS: Map<ToolType, Tool>;

  constructor(private keyboardService: KeyboardService, private clipboardService: ClipboardService,
              private boundingBoxService: BoundingBoxService, private resizeService: ResizeService,
              private moveService: MoveService, private rotationService: RotationService,
              private drawingCommunicationService: DrawingCommunicationService,
              private messageHandlerService: MessageHandlerService) {
    this.gridInfo = new Grid();
    this.gridSubject = new Subject<Grid>();

    this.TOOLS = new Map<ToolType, Tool>([
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
      [ToolType.SelectorTool, new SelectorTool(this.clipboardService, this.boundingBoxService, this.resizeService, this.moveService,
                                               this.rotationService, this.gridInfo.sizeOfSquare(), this.gridSubject.asObservable())],
      [ToolType.GridTool, new Grid()],
      [ToolType.Eraser, new EraserTool()],
      [ToolType.TextTool, new TextTool(this.primaryColor, keyboardService)],
      [ToolType.PaintBucket, new PaintBucketTool(this.primaryColor, this.secondaryColor, this.drawingCommunicationService,
         this.messageHandlerService)],
      [ToolType.QuillTool, new QuillTool(this.primaryColor)],
      [ToolType.SpraypaintTool, new SpraypaintTool(this.primaryColor, DEFAULT_SPRAYPAINT_DELAY, DEFAULT_SPRAYPAINT_RANGE)],
    ]);
    this.selectedTool = new Subject<Tool>();
    this.eyeDropperPrimaryObservable = this.eyeDropperPrimarySubject.asObservable();
    this.eyeDropperSecondaryObservable = this.eyeDropperSecondarySubject.asObservable();
    this.selectorObservable = this.selectorSubject.asObservable();

    this.keyboardService.getKeyboardShortcutType().subscribe((key: KeyboardShortcutType) => {
      if (key === KeyboardShortcutType.Grid) {
        this.showGrid(!this.gridInfo.toShow);
      } else if (key === KeyboardShortcutType.ZoomInGrid) {
        this.gridInfo.sizeOfSquare(this.gridInfo.sizeOfSquare() + (5 - this.gridInfo.sizeOfSquare() % 5));
        this.gridSubject.next(this.gridInfo);
      } else if (key === KeyboardShortcutType.ZoomOutGrid) {
        this.gridInfo.sizeOfSquare(this.gridInfo.sizeOfSquare() - (5 - this.gridInfo.sizeOfSquare() % 5));
        this.gridSubject.next(this.gridInfo);
      }
    });
  }

  newToolSelected(toolType: ToolType): void {
    if (this.TOOLS.has(toolType)) {
      this.selectedTool.next(this.TOOLS.get(toolType));
      if (toolType === ToolType.RectangleTool || toolType === ToolType.EllipseTool || toolType === ToolType.PolygonTool) {
        this.currentShapeToolTypeSelected = toolType;
      } else if (toolType === ToolType.ColorApplicator || toolType === ToolType.PaintBucket) {
        this.currentBucketToolTypeSelected = toolType;
      }
    } else if (toolType === ToolType.GridTool || toolType === ToolType.None) {
      this.selectedTool.next();
    }
    this.keyboardService.textToolActive = false;
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
  getCurrentBucketToolTypeSelected(): ToolType {
    return this.currentBucketToolTypeSelected;
  }
}
