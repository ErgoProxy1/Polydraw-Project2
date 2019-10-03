import { Component } from '@angular/core';
import { faPalette } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-color-button',
  templateUrl: './color-button.component.html',
  styleUrls: ['./color-button.component.scss'],
})
export class ColorButtonComponent {
  faPalette = faPalette;
}
