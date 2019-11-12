import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { EyeDropperTool } from 'src/app/services/tools/eyeDropperTool';
import { ToolsService } from 'src/app/services/tools/tools.service';
import { ToolType } from 'src/app/services/utils/constantsAndEnums';

@Component({
  selector: 'app-eye-dropper-properties',
  templateUrl: './eye-dropper-properties.component.html',
  styleUrls: ['./eye-dropper-properties.component.scss'],
})
export class EyeDropperPropertiesComponent implements OnInit, OnDestroy {
  private selectedToolSubscription: Subscription;
  eyeDropper: EyeDropperTool;

  constructor(private toolsService: ToolsService) {
  }

  ngOnInit(): void {
    this.selectedToolSubscription = this.toolsService.subscribeToToolChanged().subscribe((toolSelected) => {
      this.eyeDropper = toolSelected as EyeDropperTool;
    });
    this.toolsService.newToolSelected(ToolType.EyeDropper);

    this.eyeDropper.eyeDropperPrimaryObservable.subscribe((data) => {
      this.toolsService.sendPrimaryToColorTool(data);
    });
    this.eyeDropper.eyeDropperSecondaryObservable.subscribe((data) => {
      this.toolsService.sendSecondaryToColorTool(data);
    });
  }

  ngOnDestroy(): void {
    this.selectedToolSubscription.unsubscribe();
  }
}
