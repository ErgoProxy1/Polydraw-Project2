import { Component } from '@angular/core';
import { faPaintBrush } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-paint-brush-button',
  templateUrl: './paint-brush-button.component.html',
  styleUrls: ['./paint-brush-button.component.scss'],
})
export class PaintBrushButtonComponent {
  faPaintBrush = faPaintBrush;
}
