import { Component } from '@angular/core';
import { ControllerService } from 'src/app/services/controller/controller.service';

@Component({
  selector: 'app-redo',
  templateUrl: './redo.component.html',
  styleUrls: ['./redo.component.scss'],
})
export class RedoComponent {
  constructor(private controller: ControllerService) {

  }

  onClick(): void {
    this.controller.redo();
  }
}
