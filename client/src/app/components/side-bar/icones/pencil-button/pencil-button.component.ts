import { Component } from '@angular/core';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-pencil-button',
  templateUrl: './pencil-button.component.html',
  styleUrls: ['./pencil-button.component.scss'],
})
export class PencilButtonComponent {
  faPencilAlt = faPencilAlt;
}
