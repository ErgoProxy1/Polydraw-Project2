import { OnDestroy } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { MessageHandlerService } from '../messageHandler/message-handler.service';
import { DrawingCommunicationService } from '../serverCommunication/drawing-communication.service';
import { FillingPath } from '../svgPrimitives/path/fillPath/fillPath';
import { SVGPrimitive } from '../svgPrimitives/svgPrimitive';
import { PaintBucketCommand } from '../toolCommands/PaintBucketCommand';
import { ToolCommand } from '../toolCommands/toolCommand';
import { Color } from '../utils/color';
// tslint:disable-next-line: max-line-length
import { DEFAULT_PAINT_BUCKET_STROKE_WIDTH, DEFAULT_PAINT_BUCKET_TOLERANCE, MessageType, MouseEventType, PrimitiveType, StrokeType, ToolType } from '../utils/constantsAndEnums';
import { Point } from '../utils/point';
import { PaintBucketFillService } from './../paintBucketFill/paint-bucket-fill.service';
import { Tool } from './tool';

export class PaintBucketTool extends Tool implements OnDestroy {
  TYPE = ToolType.PaintBucket;
  private command: PaintBucketCommand;
  private commandSubject: Subject<PaintBucketCommand> = new Subject<PaintBucketCommand>();
  private primaryColor: Color;
  private secondaryColor: Color;
  strokeWidth: number;
  strokeType: StrokeType;
  tolerance: number;
  canvasData: string;
  canvasWidth: number;
  canvasHeight: number;
  canvasReference: HTMLCanvasElement;
  cursorPosition: Point;
  private paintBucketFillService: PaintBucketFillService;
  private primitive: FillingPath;
  private canvasSubscription: Subscription;
  private drawingCommunicationService: DrawingCommunicationService;
  private messageHandlerSevice: MessageHandlerService;
  private isClicked = false;

  constructor(primaryColor: Color, secondaryColor: Color, drawingCommunicationService: DrawingCommunicationService,
              messageHandlerSevice: MessageHandlerService) {
    super();
    this.canvasData = '';
    this.canvasWidth = 0;
    this.canvasHeight = 0;
    this.cursorPosition = new Point(0, 0);
    this.primaryColor = primaryColor;
    this.secondaryColor = secondaryColor;
    this.strokeWidth = DEFAULT_PAINT_BUCKET_STROKE_WIDTH;
    this.tolerance = DEFAULT_PAINT_BUCKET_TOLERANCE;
    this.paintBucketFillService = new PaintBucketFillService();
    this.strokeType = StrokeType.FullWithOutline;
    this.drawingCommunicationService = drawingCommunicationService;
    this.messageHandlerSevice = messageHandlerSevice;
    this.canvasSubscription = this.drawingCommunicationService.canvasObservable.subscribe((data: string) => {
      this.canvasData = data;
      if (this.isClicked) {
        this.isClicked = false;
        this.generateCanvas();
      }
    });
  }
  ngOnDestroy(): void {
    if (this.canvasSubscription) {
      this.canvasSubscription.unsubscribe();
      delete this.canvasSubscription;
    }
  }

  mouseEvent(eventType: MouseEventType, position: Point, primitive?: SVGPrimitive | undefined): void {
    if (eventType === MouseEventType.MouseClickLeft || eventType === MouseEventType.MouseClickRight) {
      this.cursorPosition = Point.copyPoint(position);
      this.isClicked = true;
      this.drawingCommunicationService.sendSvgHtmlRequest(false);
    }
  }

  subscribeToCommand(): Observable<ToolCommand> {
    return this.commandSubject.asObservable();
  }

  getColors(): Color {
    return this.primaryColor;
  }
  getColors2(): Color {
    return this.secondaryColor;
  }

  private createCommand(): void {
    this.command = new PaintBucketCommand(this.primitive);
    this.commandSubject.next(this.command);
  }

  private generateCanvas(): Promise<void> {
    const context = (this.canvasReference.getContext('2d') as CanvasRenderingContext2D);
    const img = new Image();
    img.src = this.canvasData;
    return new Promise((resolve, reject) => {
      this.loadImage(img).then(() => {
        context.drawImage(img, 0, 0, this.canvasWidth, this.canvasHeight);
        this.primitive = new FillingPath(Color.copyColor(this.primaryColor), Color.copyColor(this.secondaryColor),
          this.strokeWidth, PrimitiveType.Fill, this.strokeType);
        this.paintBucketFillService.setUpInfos(context, this.canvasWidth, this.canvasHeight, this.tolerance, this.primitive);
        if (this.paintBucketFillService.startFilling(this.cursorPosition)) {
          this.createCommand();
          resolve();
        } else {
          this.messageHandlerSevice.showMessage('Remplissage impossible. Temps d\'attente dépassé', MessageType.Danger, 5000);
          reject();
        }
      });
    });
  }

  private async loadImage(image: HTMLImageElement): Promise<boolean> {
    return new Promise((resolve, reject) => {
      image.onload = () => resolve(true);
      image.onerror = () => reject(false);
    });
  }

  // Pour rcevoir les information du canvas(notre svg html element) actuel pour bien crée le canvas sur lequel on pourra lire les pixels
  setCanvasInfo(width: number, height: number, canvas: HTMLCanvasElement): void {
    this.canvasWidth = width;
    this.canvasHeight = height;
    this.canvasReference = canvas;
  }
}
