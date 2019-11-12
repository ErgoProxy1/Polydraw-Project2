import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { TextTool } from 'src/app/services/tools/textTool';
import { ToolsService } from 'src/app/services/tools/tools.service';
import { AlignInfo, ALIGNS, FontInfo, FONTS, ToolType } from '../../../../services/utils/constantsAndEnums';

@Component({
  selector: 'app-text-properties',
  templateUrl: './text-properties.component.html',
  styleUrls: ['./text-properties.component.scss'],
})
export class TextPropertiesComponent implements OnInit, OnDestroy {

  readonly FONTS: FontInfo[] = FONTS;
  readonly ALIGNS: AlignInfo[] = ALIGNS;

  private selectedToolSubscription: Subscription;

  currentFontFamily: string = FONTS[0].family;
  textTool: TextTool;
  currentAlign: AlignInfo = ALIGNS[0];

  constructor(private toolsService: ToolsService) {

  }

  ngOnInit(): void {
    this.selectedToolSubscription = this.toolsService.subscribeToToolChanged().subscribe((toolSelected) => {
      this.textTool = toolSelected as TextTool;
    });
    this.toolsService.newToolSelected(ToolType.TextTool);
    this.textTool.selectedFont = 0;
    this.textTool.selectedAlign = 0;
  }

  ngOnDestroy(): void {
    this.selectedToolSubscription.unsubscribe();
  }

  onChangeFont(value: string): void {
    for (let i = 0; i < FONTS.length; i++) {
      if (FONTS[i].name === value) {
        this.currentFontFamily = FONTS[i].family;
        this.textTool.selectedFont = i;
      }
    }
  }

  onChangeAlign(value: string): void {
    for (let i = 0; i < ALIGNS.length; i++) {
      if (ALIGNS[i].name === value) {
        this.currentAlign = ALIGNS[i];
        this.textTool.selectedAlign = i;
      }
    }
  }

  applyText(): void {
    if (this.textTool.typing) {
      this.textTool.applyText();
    }
  }

}
