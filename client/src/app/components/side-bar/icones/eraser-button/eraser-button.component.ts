import { Component, OnInit } from '@angular/core';
import { faEraser } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-eraser-button',
  templateUrl: './eraser-button.component.html',
  styleUrls: ['./eraser-button.component.scss'],
})
export class EraserButtonComponent implements OnInit {
  faEraser = faEraser;
  constructor() {
    // TODO
  }

  ngOnInit(): void {
    // TODO
  }

}
