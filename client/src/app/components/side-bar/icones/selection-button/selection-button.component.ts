import { Component } from '@angular/core';
import { faMousePointer } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-selection-button',
  templateUrl: './selection-button.component.html',
  styleUrls: ['./selection-button.component.scss'],
})
export class SelectionButtonComponent {
  faMousePointer = faMousePointer;
}
