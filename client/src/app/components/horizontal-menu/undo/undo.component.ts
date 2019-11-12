import { Component } from '@angular/core';
import { ControllerService } from 'src/app/services/controller/controller.service';

@Component({
  selector: 'app-undo',
  templateUrl: './undo.component.html',
  styleUrls: ['./undo.component.scss'],
})
export class UndoComponent {
  constructor(private controller: ControllerService) {

  }

  onClick(): void {
    this.controller.undo();
  }
}
