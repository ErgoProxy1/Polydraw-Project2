import { Component } from '@angular/core';
import { faPenFancy } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-pen-button',
  templateUrl: './pen-button.component.html',
  styleUrls: ['./pen-button.component.scss'],
})
export class PenButtonComponent {
  faPen = faPenFancy;
}
