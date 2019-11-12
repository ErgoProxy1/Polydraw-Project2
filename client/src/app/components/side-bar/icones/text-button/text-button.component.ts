import { Component } from '@angular/core';
import { faItalic } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-text-button',
  templateUrl: './text-button.component.html',
  styleUrls: ['./text-button.component.scss'],
})
export class TextButtonComponent {

  faText = faItalic;

}
