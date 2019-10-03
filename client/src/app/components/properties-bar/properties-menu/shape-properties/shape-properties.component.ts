import { Component, OnDestroy, OnInit} from '@angular/core';
import { Subscription } from 'rxjs';
import { RectangleTool } from 'src/app/services/tools/rectangleTool';
import { ToolsService } from 'src/app/services/tools/tools.service';
import { MAX_STROKE_WIDTH, MIN_STROKE_WIDTH, StrokeType, ToolType } from 'src/app/services/utils/constantsAndEnums';

@Component({
  selector: 'app-shape-properties',
  templateUrl: './shape-properties.component.html',
  styleUrls: ['./shape-properties.component.scss'],
})
export class ShapePropertiesComponent implements OnInit, OnDestroy {
  private selectedToolSubscription: Subscription;
  rectangle: RectangleTool;
  readonly STROKE_TYPE_NAMES_MAP: Map<string, StrokeType> = new Map([
    ['Contour et remplissage', StrokeType.FullWithOutline],
    ['Remplissage seulement', StrokeType.Full],
    ['Contour seulement', StrokeType.Outline],
  ]);
  private strokeWidth: number;
  private strokeType: StrokeType;

  readonly MAX_STROKE_WIDTH = MAX_STROKE_WIDTH;
  readonly MIN_STROKE_WIDTH = MIN_STROKE_WIDTH;

  constructor(private toolsService: ToolsService) { }

  ngOnInit() {
    this.selectedToolSubscription = this.toolsService.subscribeToToolChanged().subscribe((toolSelected) => {
      this.rectangle = toolSelected as RectangleTool;
    });

    this.toolsService.newToolSelected(ToolType.RectangleTool);

    this.strokeWidth = this.rectangle.strokeWidth;
    this.strokeType = this.rectangle.strokeType;
  }

  ngOnDestroy() {
    this.selectedToolSubscription.unsubscribe();
  }

  onChangeStrokeWidth(): void {
    if (this.strokeWidth > MAX_STROKE_WIDTH) {
      this.strokeWidth = MAX_STROKE_WIDTH;
    } else if (this.strokeWidth < MIN_STROKE_WIDTH) {
      this.strokeWidth = MIN_STROKE_WIDTH;
    }
    this.rectangle.strokeWidth = this.strokeWidth;
  }

  onChangeStrokeType(): void {
    if (this.strokeType in StrokeType) {
      this.rectangle.strokeType = this.strokeType;
    } else {
      this.strokeType = this.rectangle.strokeType;
    }
  }
}
