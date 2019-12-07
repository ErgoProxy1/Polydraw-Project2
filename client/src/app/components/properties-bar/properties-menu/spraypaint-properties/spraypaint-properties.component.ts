import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SpraypaintTool } from 'src/app/services/tools/spraypaintTool';
import { ToolsService } from 'src/app/services/tools/tools.service';
import { MAX_SPRAYPAINT_FLOW_PER_SECOND, MAX_SPRAYPAINT_RANGE,
  MIN_SPRAYPAINT_FLOW_PER_SECOND, MIN_SPRAYPAINT_RANGE, SECOND_TO_MILI_SECOND, ToolType } from 'src/app/services/utils/constantsAndEnums';

@Component({
  selector: 'app-spraypaint-properties',
  templateUrl: './spraypaint-properties.component.html',
  styleUrls: ['./spraypaint-properties.component.scss'],
})
export class SpraypaintPropertiesComponent implements OnInit, OnDestroy {

  readonly MAX_RANGE = MAX_SPRAYPAINT_RANGE;
  readonly MIN_RANGE = MIN_SPRAYPAINT_RANGE;
  readonly MAX_PAINTDELAY = MAX_SPRAYPAINT_FLOW_PER_SECOND;
  readonly MIN_PAINTDELAY = MIN_SPRAYPAINT_FLOW_PER_SECOND;

  private paintDelay: number;
  private range: number;
  private selectedToolSubscription: Subscription;
  spraypaint: SpraypaintTool;

  constructor(private toolsService: ToolsService) {
  }

  ngOnInit(): void {
    this.selectedToolSubscription = this.toolsService.subscribeToToolChanged().subscribe((toolSelected) => {
      this.spraypaint = toolSelected as SpraypaintTool;
    });

    this.toolsService.newToolSelected(ToolType.SpraypaintTool);

    this.range = this.spraypaint.range;
    this.paintDelay = SECOND_TO_MILI_SECOND / this.spraypaint.paintDelay;
  }

  ngOnDestroy(): void {
    this.selectedToolSubscription.unsubscribe();
  }

  onChangeRange(): void {
    if (this.range > this.MAX_RANGE) {
      this.range = this.MAX_RANGE;
    } else if (this.range < this.MIN_RANGE) {
      this.range = this.MIN_RANGE;
    }
    this.spraypaint.range = this.range;
  }

  onChangePaintDelay(): void {
    if (this.paintDelay > this.MAX_PAINTDELAY) {
      this.spraypaint.paintDelay = 1000 / this.paintDelay;
    } else if (this.paintDelay < this.MIN_PAINTDELAY) {
      this.paintDelay = this.MIN_PAINTDELAY;
    }
    this.spraypaint.paintDelay = SECOND_TO_MILI_SECOND / this.paintDelay;
  }
}
