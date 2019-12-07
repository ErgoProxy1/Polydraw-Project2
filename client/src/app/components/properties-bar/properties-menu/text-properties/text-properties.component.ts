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
    this.textTool.selectedFont = FONTS[0];
    this.textTool.selectedAlign = ALIGNS[0];
  }

  ngOnDestroy(): void {
    this.selectedToolSubscription.unsubscribe();
  }

  onChangeFont(name: string): void {
    const font: FontInfo | undefined = FONTS.find((value: FontInfo) => value.name === name);
    if (font) {
      this.currentFontFamily = font.family;
      this.textTool.selectedFont = font;
    }
  }

  onChangeAlign(name: string): void {
    const align: AlignInfo | undefined = ALIGNS.find((value: AlignInfo) => value.name === name);
    if (align) {
      this.currentAlign = align;
      this.textTool.selectedAlign = align;
    }
  }

  applyText(): void {
    if (this.textTool.typing) {
      this.textTool.applyText();
    }
  }

}
