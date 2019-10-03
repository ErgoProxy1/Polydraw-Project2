import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ToolsService } from 'src/app/services/tools/tools.service';
import { ToolType } from 'src/app/services/utils/constantsAndEnums';

@Component({
  selector: 'app-color-properties',
  templateUrl: './color-properties.component.html',
  styleUrls: ['./color-properties.component.scss'],
})
export class ColorPropertiesComponent implements OnInit, OnDestroy {
  private selectedToolSubscription: Subscription;

  constructor(private toolsService: ToolsService) {
    this.toolsService.newToolSelected(ToolType.None);
  }

  ngOnInit() {
    this.toolsService.newToolSelected(ToolType.None);
  }

  ngOnDestroy() {
    this.selectedToolSubscription.unsubscribe();
  }
}
