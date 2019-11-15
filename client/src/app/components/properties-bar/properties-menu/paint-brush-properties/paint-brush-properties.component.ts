import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { PaintBrushTool } from 'src/app/services/tools/paintBrushTool';
import { ToolsService } from 'src/app/services/tools/tools.service';
import { MAX_STROKE_WIDTH, MIN_STROKE_WIDTH, Texture, ToolType } from 'src/app/services/utils/constantsAndEnums';

@Component({
  selector: 'app-paint-brush-properties',
  templateUrl: './paint-brush-properties.component.html',
  styleUrls: ['./paint-brush-properties.component.scss'],
})
export class PaintBrushPropertiesComponent implements OnInit, OnDestroy {
  readonly MAX_STROKE = MAX_STROKE_WIDTH;
  readonly MIN_STROKE = MIN_STROKE_WIDTH;
  readonly TEXTURE_NAMES_MAP: Map<string, Texture> = new Map([
    ['Basic', Texture.Basic],
    ['Light', Texture.Degraded],
    ['Shiny', Texture.Grayed],
    ['Mossy', Texture.Light],
    ['Frothy', Texture.Frothy],
  ]);

  private strokeWidth: number;
  private texture: Texture;
  private selectedToolSubscription: Subscription;
  paintBrush: PaintBrushTool;

  constructor(private toolsService: ToolsService) {

  }

  ngOnInit(): void {
    this.selectedToolSubscription = this.toolsService.subscribeToToolChanged().subscribe((toolSelected) => {
      this.paintBrush = toolSelected as PaintBrushTool;
    });

    this.toolsService.newToolSelected(ToolType.PaintBrushTool);

    this.strokeWidth = this.paintBrush.strokeWidth;
    this.texture = this.paintBrush.texture;
  }

  ngOnDestroy(): void {
    this.selectedToolSubscription.unsubscribe();
  }

  onChangeStrokeWidth(): void {
    if (this.strokeWidth > this.MAX_STROKE) {
      this.strokeWidth = this.MAX_STROKE;
    } else if (this.strokeWidth < this.MIN_STROKE) {
      this.strokeWidth = this.MIN_STROKE;
    }
    this.paintBrush.strokeWidth = this.strokeWidth;
  }

  onChangeTexture(): void {
    if (this.texture in Texture) {
      this.paintBrush.texture = this.texture;
    } else {
      this.texture = this.paintBrush.texture;
    }
  }
}
