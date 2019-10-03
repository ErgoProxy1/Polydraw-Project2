import { Component } from '@angular/core';
import { faShapes } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-shapes-button',
  templateUrl: './shapes-button.component.html',
  styleUrls: ['./shapes-button.component.scss'],
})
export class ShapesButtonComponent {
  faShapes = faShapes;
}
