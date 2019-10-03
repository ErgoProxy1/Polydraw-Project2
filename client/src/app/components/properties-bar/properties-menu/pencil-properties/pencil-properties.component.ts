import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { PencilTool } from 'src/app/services/tools/pencilTool';
import { ToolsService } from 'src/app/services/tools/tools.service';
import { MAX_STROKE_WIDTH, MIN_STROKE_WIDTH, ToolType } from 'src/app/services/utils/constantsAndEnums';

@Component({
  selector: 'app-pencil-properties',
  templateUrl: './pencil-properties.component.html',
  styleUrls: ['./pencil-properties.component.scss'],
})
export class PencilPropertiesComponent implements OnInit, OnDestroy {
  private selectedToolSubscription: Subscription;
  strokeWidth: number;
  pencil: PencilTool;

  readonly MAX_STROKE_WIDTH = MAX_STROKE_WIDTH;
  readonly MIN_STROKE_WIDTH = MIN_STROKE_WIDTH;

  constructor(private toolsService: ToolsService) {
  }

  ngOnInit() {
    this.selectedToolSubscription = this.toolsService.subscribeToToolChanged().subscribe((toolSelected) => {
      this.pencil = toolSelected as PencilTool;
    });

    this.toolsService.newToolSelected(ToolType.Pencil);

    this.strokeWidth = this.pencil.strokeWidth;
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
    this.pencil.strokeWidth = this.strokeWidth;
  }
}
