import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SelectorTool } from 'src/app/services/tools/selectorTool';
import { ToolsService } from 'src/app/services/tools/tools.service';
import { ToolType } from 'src/app/services/utils/constantsAndEnums';

@Component({
  selector: 'app-selection-properties',
  templateUrl: './selection-properties.component.html',
  styleUrls: ['./selection-properties.component.scss'],
})
export class SelectionPropertiesComponent implements OnInit, OnDestroy {
  private selectedToolSubscription: Subscription;
  strokeWidth: number;
  selector: SelectorTool;

  constructor(private toolsService: ToolsService) {
  }

  ngOnInit() {
    this.selectedToolSubscription = this.toolsService.subscribeToToolChanged().subscribe((toolSelected) => {
      this.selector = toolSelected as SelectorTool;
    });

    this.toolsService.newToolSelected(ToolType.SelectorTool);
  }

  ngOnDestroy() {
    this.selectedToolSubscription.unsubscribe();
  }
}
