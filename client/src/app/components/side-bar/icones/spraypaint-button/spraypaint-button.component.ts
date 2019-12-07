import { Component} from '@angular/core';
import { faSprayCan } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-spraypaint-button',
  templateUrl: './spraypaint-button.component.html',
  styleUrls: ['./spraypaint-button.component.scss'],
})
export class SpraypaintButtonComponent {
  spraypaintIcon = faSprayCan;
}
