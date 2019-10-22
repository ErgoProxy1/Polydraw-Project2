import { Component} from '@angular/core';
import { faWaveSquare } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-line-button',
  templateUrl: './line-button.component.html',
  styleUrls: ['./line-button.component.scss'],
})
export class LineButtonComponent {
  bezierCurve = faWaveSquare;
}
