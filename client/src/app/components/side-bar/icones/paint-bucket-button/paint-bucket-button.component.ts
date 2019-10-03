import { Component } from '@angular/core';
import { faFillDrip } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-paint-bucket-button',
  templateUrl: './paint-bucket-button.component.html',
  styleUrls: ['./paint-bucket-button.component.scss'],
})
export class PaintBucketButtonComponent  {
  faFillDrip = faFillDrip;
}
