import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { StampTool } from 'src/app/services/tools/stampTool';
import { ToolsService } from 'src/app/services/tools/tools.service';
import { ToolType } from 'src/app/services/utils/constantsAndEnums';
import { DEFAULT_STAMPS, StampInfo } from 'src/app/services/utils/stampData';

@Component({
  selector: 'app-stamp-properties',
  templateUrl: './stamp-properties.component.html',
  styleUrls: ['./stamp-properties.component.scss'],
})
export class StampPropertiesComponent implements OnInit, OnDestroy {
  readonly MIN_ANGLE: number = 0;
  readonly MAX_ANGLE: number = 359;
  readonly MIN_SCALE: number = 25;
  readonly MAX_SCALE: number = 300;
  readonly STAMPS: StampInfo[] = DEFAULT_STAMPS;

  private selectedToolSubscription: Subscription;
  stamp: StampTool;

  scale: number;
  rotationAngle: number;

  constructor(private toolsService: ToolsService) {

  }

  ngOnInit(): void {
    this.selectedToolSubscription = this.toolsService.subscribeToToolChanged().subscribe((toolSelected) => {
      this.stamp = toolSelected as StampTool;
    });

    this.toolsService.newToolSelected(ToolType.StampTool);
    this.scale = this.stamp.scale;
    this.applyRotation(this.stamp.angle);
    this.stamp.selected = 0;
    this.stamp.angleObservable.subscribe((data) => {
      this.applyRotation(data);
    });
  }

  ngOnDestroy(): void {
    this.selectedToolSubscription.unsubscribe();
  }

  onChangeRotation(): void {
    if (this.rotationAngle > this.MAX_ANGLE) {
      this.rotationAngle = this.MAX_ANGLE;
    } else if (this.rotationAngle < this.MIN_ANGLE) {
      this.rotationAngle = this.MIN_ANGLE;
    }
    this.stamp.angle = this.rotationAngle;
  }

  onChangeScale(): void {
    if (this.scale > this.MAX_SCALE) {
      this.scale = this.MAX_SCALE;
    } else if (this.scale < this.MIN_SCALE) {
      this.scale = this.MIN_SCALE;
    }
    this.stamp.scale = this.scale;
  }

  onChangeStamp(value: string) {
    for (let i = 0; i < this.STAMPS.length; i++) {
      if (this.STAMPS[i].name === value) {
        this.stamp.selected = i;
        break;
      }
    }
  }

  applyRotation(angle: number) {
    if (angle < this.MIN_ANGLE ) { angle += 360; }
    if (angle > this.MAX_ANGLE) { angle = this.MIN_ANGLE; }
    this.rotationAngle = angle;
  }

}
