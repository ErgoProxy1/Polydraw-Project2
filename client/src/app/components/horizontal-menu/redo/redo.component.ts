import { Component } from '@angular/core';
import { CanvasControllerService } from 'src/app/services/canvasController/canvas-controller.service';

@Component({
  selector: 'app-redo',
  templateUrl: './redo.component.html',
  styleUrls: ['./redo.component.scss'],
})
export class RedoComponent {
  constructor(private controller: CanvasControllerService) {

  }

  onClick(): void {
    this.controller.redo();
  }
}
