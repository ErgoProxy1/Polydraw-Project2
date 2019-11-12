import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ToolsService } from 'src/app/services/tools/tools.service';
import { ToolType } from 'src/app/services/utils/constantsAndEnums';

@Component({
  selector: 'app-paint-bucket-properties',
  templateUrl: './paint-bucket-properties.component.html',
  styleUrls: ['./paint-bucket-properties.component.scss'],
})
export class PaintBucketPropertiesComponent implements OnInit, OnDestroy {
  private selectedToolSubscription: Subscription;

  constructor(private toolsService: ToolsService) {

  }

  ngOnInit(): void {
    this.selectedToolSubscription = this.toolsService.subscribeToToolChanged().subscribe((toolSelected) => {
     // TODO: a ajouter si on ajoute des proprietes modifiables dans ce component a cet outil:
     // this.bucket = toolSelected as BucketTool;
    });
    this.toolsService.newToolSelected(ToolType.ColorApplicator);
  }

  ngOnDestroy(): void {
    this.selectedToolSubscription.unsubscribe();
  }
}
