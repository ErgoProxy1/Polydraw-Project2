import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { PenTool } from 'src/app/services/tools/penTool';
import { ToolsService } from 'src/app/services/tools/tools.service';
import { MAX_OF_MAX_PEN_STROKE_WIDTH, MAX_OF_MIN_PEN_STROKE_WIDTH,
  MIN_OF_MAX_PEN_STROKE_WIDTH, MIN_OF_MIN_PEN_STROKE_WIDTH,
  ToolType } from 'src/app/services/utils/constantsAndEnums';

@Component({
  selector: 'app-pen-properties',
  templateUrl: './pen-properties.component.html',
  styleUrls: ['./pen-properties.component.scss'],
})
export class PenPropertiesComponent implements OnInit, OnDestroy {
  private selectedToolSubscription: Subscription;
  strokeWidth: number;
  minStrokeWidth: number;
  pen: PenTool;
  readonly MAX_SLIDER_MAX_STROKEWITH = MAX_OF_MAX_PEN_STROKE_WIDTH;
  readonly MAX_SLIDER_MIN_STROKEWITH = MIN_OF_MAX_PEN_STROKE_WIDTH;
  readonly MIN_SLIDER_MAX_STROKEWITH = MAX_OF_MIN_PEN_STROKE_WIDTH;
  readonly MIN_SLIDER_MIN_STROKEWITH = MIN_OF_MIN_PEN_STROKE_WIDTH;

  constructor(private toolsService: ToolsService) {
  }

  ngOnInit(): void {
    this.selectedToolSubscription = this.toolsService.subscribeToToolChanged().subscribe((toolSelected) => {
      this.pen = toolSelected as PenTool;
    });

    this.toolsService.newToolSelected(ToolType.Pen);
    this.strokeWidth = this.pen.strokeWidth;
    this.minStrokeWidth = this.pen.minStrokeWidth;
  }

  ngOnDestroy(): void {
    this.selectedToolSubscription.unsubscribe();
  }

  onChangeStrokeWidth(): void {
    if (this.strokeWidth > MAX_OF_MAX_PEN_STROKE_WIDTH) {
      this.strokeWidth = MAX_OF_MAX_PEN_STROKE_WIDTH;
    } else if (this.strokeWidth < MIN_OF_MAX_PEN_STROKE_WIDTH) {
      this.strokeWidth = MIN_OF_MAX_PEN_STROKE_WIDTH;
    }
    if (this.strokeWidth < this.minStrokeWidth) {
      this.minStrokeWidth = this.strokeWidth;
    }
    this.pen.strokeWidth = this.strokeWidth;
  }

  onChangeMinStrokeWidth(): void {
    if (this.minStrokeWidth > MAX_OF_MIN_PEN_STROKE_WIDTH) {
      this.minStrokeWidth = MAX_OF_MIN_PEN_STROKE_WIDTH;
    } else if (this.minStrokeWidth < MIN_OF_MIN_PEN_STROKE_WIDTH) {
      this.minStrokeWidth = MIN_OF_MIN_PEN_STROKE_WIDTH;
    }
    if (this.minStrokeWidth > this.strokeWidth) {
      this.strokeWidth = this.minStrokeWidth;
    }
    this.pen.minStrokeWidth = this.minStrokeWidth;
  }
}
