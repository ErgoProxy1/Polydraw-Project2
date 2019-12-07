import { Component } from '@angular/core';
import { CanvasControllerService } from 'src/app/services/canvasController/canvas-controller.service';
import { KeyboardService } from 'src/app/services/keyboard/keyboard.service';
import { TextTool } from 'src/app/services/tools/textTool';
import { ToolType } from 'src/app/services/utils/constantsAndEnums';

@Component({
  selector: 'app-horizontal-menu',
  templateUrl: './horizontal-menu.component.html',
  styleUrls: ['./horizontal-menu.component.scss'],
})

export class HorizontalMenuComponent {

  constructor(private keyboardService: KeyboardService, private controller: CanvasControllerService) { }

  resetKeyboardService(): void {
    this.keyboardService.inputFocusedActive = false;
    this.keyboardService.textToolActive = false;
    if (this.controller.tool.TYPE === ToolType.TextTool) {
      (this.controller.tool as TextTool).applyText();
    }
  }
}
