import { Component } from '@angular/core';
import { CanvasControllerService } from 'src/app/services/canvasController/canvas-controller.service';

@Component({
  selector: 'app-undo',
  templateUrl: './undo.component.html',
  styleUrls: ['./undo.component.scss'],
})
export class UndoComponent {
  constructor(private controller: CanvasControllerService) {

  }

  onClick(): void {
    this.controller.undo();
  }
}
