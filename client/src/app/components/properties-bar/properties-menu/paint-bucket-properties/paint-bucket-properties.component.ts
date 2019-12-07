import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CanvasControllerService } from 'src/app/services/canvasController/canvas-controller.service';
import { ToolsService } from 'src/app/services/tools/tools.service';
// tslint:disable-next-line: max-line-length
import { DEFAULT_PAINT_BUCKET_STROKE_WIDTH, DEFAULT_PAINT_BUCKET_TOLERANCE, MAX_PAINT_BUCKET_TOLERANCE, MAX_STROKE_WIDTH, MIN_PAINT_BUCKET_TOLERANCE, MIN_STROKE_WIDTH, PaintBucketType, StrokeType, ToolType } from 'src/app/services/utils/constantsAndEnums';
import { RoutingConstants } from 'src/app/services/utils/routingConstants';
import { PaintBucketTool } from './../../../../services/tools/paintBucketTool';

@Component({
  selector: 'app-paint-bucket-properties',
  templateUrl: './paint-bucket-properties.component.html',
  styleUrls: ['./paint-bucket-properties.component.scss'],
})
export class PaintBucketPropertiesComponent implements OnInit, OnDestroy {

  private selectedToolSubscription: Subscription;
  readonly PAINT_BUCKET_TYPE_MAP: Map<string, PaintBucketType> = new Map([
    ['Applicateur couleur', PaintBucketType.Applicator],
    ['Remplissage', PaintBucketType.Fill],
  ]);
  readonly STROKE_TYPE_NAMES_MAP: Map<string, StrokeType> = new Map([
    ['Contour et remplissage', StrokeType.FullWithOutline],
    ['Remplissage seulement', StrokeType.Full],
    ['Contour seulement', StrokeType.Outline],
  ]);
  paintBucketType: PaintBucketType; // Pour le dropdown dans le html
  isFill: boolean;
  strokeWidth: number;
  strokeType: StrokeType;
  _MAX_STROKE_WIDTH = MAX_STROKE_WIDTH;
  _MIN_STROKE_WIDTH = MIN_STROKE_WIDTH;
  _MAX_PAINT_BUCKET_TOLERANCE = MAX_PAINT_BUCKET_TOLERANCE;
  _MIN_PAINT_BUCKET_TOLERANCE = MIN_PAINT_BUCKET_TOLERANCE;
  paintBucketTool: PaintBucketTool;
  tolerance: number;

  private toolType: ToolType;
  private routeParametersSubscription: Subscription;

  canvasWidth: number;
  canvasHeight: number;

  @ViewChild('canvasSim', { static: true }) canvasSim: ElementRef;

  constructor(private toolsService: ToolsService,
              private router: Router,
              private route: ActivatedRoute,
              private controller: CanvasControllerService, ) {
    this.paintBucketType = PaintBucketType.Fill;
    this.strokeWidth = DEFAULT_PAINT_BUCKET_STROKE_WIDTH;
    this.tolerance = DEFAULT_PAINT_BUCKET_TOLERANCE;
    this.canvasWidth = this.controller.canvasInfo.width;
    this.canvasHeight = this.controller.canvasInfo.height;
  }

  ngOnInit(): void {
    this.selectedToolSubscription = this.toolsService.subscribeToToolChanged().subscribe((toolSelected) => {
      this.paintBucketTool = toolSelected as PaintBucketTool;
      if (this.paintBucketTool) {
        this.toolType = this.paintBucketTool.TYPE;
        this.strokeWidth = this.paintBucketTool.strokeWidth;
        this.tolerance = this.paintBucketTool.tolerance;
        this.strokeType = this.paintBucketTool.strokeType;
      }
    });

    this.routeParametersSubscription = this.route.params.subscribe((params) => {
      const bucketType: string = params.bucketType;
      if (bucketType) {
        if (bucketType === RoutingConstants.PAINT_BUCKET_FILL_TYPE) {
          this.toolType = ToolType.PaintBucket;
          this.paintBucketType = PaintBucketType.Fill;
          this.toolsService.newToolSelected(this.toolType);
        } else if (bucketType === RoutingConstants.COLOR_APPLICATOR_TYPE) {
          this.toolType = ToolType.ColorApplicator;
          this.toolsService.newToolSelected(this.toolType);
          this.paintBucketType = PaintBucketType.Applicator;
        }
      } else {
        this.toolType = this.toolsService.getCurrentBucketToolTypeSelected();
      }
      this.onChangePaintBucketType();

    });

    // Recupere le svg du canvas component
    this.canvasWidth = this.controller.canvasInfo.width;
    this.canvasHeight = this.controller.canvasInfo.height;
    this.paintBucketTool.setCanvasInfo(this.canvasWidth,
      this.canvasHeight, (this.canvasSim.nativeElement as HTMLCanvasElement));

    this.onChangePaintBucketType();
  }

  ngOnDestroy(): void {
    this.selectedToolSubscription.unsubscribe();
    this.routeParametersSubscription.unsubscribe();
  }

  // Pour le toolType
  private navigateToGoodRouter(): void {
    switch (this.toolType) {
      case ToolType.PaintBucket:
        this.router.navigate([RoutingConstants.ROUTE_TO_PAINT_BUCKET, RoutingConstants.PAINT_BUCKET_FILL_TYPE]);
        break;
      case ToolType.ColorApplicator:
        this.router.navigate([RoutingConstants.ROUTE_TO_PAINT_BUCKET, RoutingConstants.COLOR_APPLICATOR_TYPE]);
        break;
    }
    this.toolsService.newToolSelected(this.toolType);
  }

  // Pour le dropdown
  onChangePaintBucketType(): void {
    if (this.paintBucketType === PaintBucketType.Fill) {
      this.isFill = true;
      this.toolType = ToolType.PaintBucket;
    } else {
      this.isFill = false;
      this.toolType = ToolType.ColorApplicator;
    }

    this.navigateToGoodRouter();
  }

  onChangeStrokeType(): void {
    if (this.paintBucketTool) {
      if (this.strokeType in StrokeType) {
        this.paintBucketTool.strokeType = this.strokeType;
      } else {
        this.strokeType = this.paintBucketTool.strokeType;
      }
    }
  }

  onChangeStrokeWidth(): void {
    if (this.strokeWidth > this._MAX_STROKE_WIDTH) {
      this.strokeWidth = this._MAX_STROKE_WIDTH;
    } else if (this.strokeWidth < this._MIN_STROKE_WIDTH) {
      this.strokeWidth = this._MIN_STROKE_WIDTH;
    }
    this.paintBucketTool.strokeWidth = this.strokeWidth;
  }

  onChangeTolerance(): void {
    if (this.tolerance > this._MAX_PAINT_BUCKET_TOLERANCE) {
      this.tolerance = this._MAX_PAINT_BUCKET_TOLERANCE;
    } else if (this.tolerance < this._MIN_PAINT_BUCKET_TOLERANCE) {
      this.tolerance = this._MIN_PAINT_BUCKET_TOLERANCE;
    }
    this.paintBucketTool.tolerance = this.tolerance;
  }
}
