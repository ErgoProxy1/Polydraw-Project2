import { Component, ElementRef, ViewChild } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { KeyboardService } from 'src/app/services/keyboard/keyboard.service';

@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.component.html',
  styleUrls: ['./tutorial.component.scss'],
})
export class TutorialComponent {

  @ViewChild('tutorialModal', {static: true}) tutorialModal: ElementRef;

  tutorialModalConfig: NgbModalOptions = {
    backdrop: 'static',
    size: 'lg',
    centered: true,
    keyboard: false,
  };

  constructor(private keyboardService: KeyboardService, private modalService: NgbModal) { }

  openModal(): boolean {
    this.keyboardService.modalWindowActive = true;
    this.modalService.open(this.tutorialModal, this.tutorialModalConfig);
    return this.modalService.hasOpenModals();
  }

  closeModal(): boolean {
    this.keyboardService.modalWindowActive = false;
    this.modalService.dismissAll();
    return this.modalService.hasOpenModals();
  }
}
