import { Component } from '@angular/core';
import { faFeatherAlt } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-quill-button',
  templateUrl: './quill-button.component.html',
  styleUrls: ['./quill-button.component.scss'],
})
export class QuillButtonComponent {
  faFeatherAlt = faFeatherAlt;
}
