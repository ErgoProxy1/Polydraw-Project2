import { Component } from '@angular/core';
import { faSprayCan } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-spray-button',
  templateUrl: './spray-button.component.html',
  styleUrls: ['./spray-button.component.scss'],
})
export class SprayButtonComponent {
  faSprayCan = faSprayCan;
}
