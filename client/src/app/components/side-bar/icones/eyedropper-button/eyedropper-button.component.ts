import { Component} from '@angular/core';
import { faEyeDropper, IconDefinition } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-eyedropper-button',
  templateUrl: './eyedropper-button.component.html',
  styleUrls: ['./eyedropper-button.component.scss'],
})
export class EyedropperButtonComponent {
  faEyeDropper: IconDefinition = faEyeDropper;
}
