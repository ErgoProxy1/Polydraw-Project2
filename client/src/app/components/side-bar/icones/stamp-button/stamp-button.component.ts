import { Component} from '@angular/core';
import { faStamp } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-stamp-button',
  templateUrl: './stamp-button.component.html',
  styleUrls: ['./stamp-button.component.scss'],
})
export class StampButtonComponent {

  fastamp = faStamp;
}
