import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { KeyboardShortcutService } from 'src/app/services/keyboardShortcut/keyboard-shortcut.service';
import { UserInfoService } from '../../services/userInfo/userinfo.service';

@Component({
  selector: 'app-welcome-message',
  templateUrl: './welcome-message.component.html',
  styleUrls: ['./welcome-message.component.scss'],
})

export class WelcomeMessageComponent implements OnInit {

  @ViewChild('welcomeModal', { static: true }) welcomeModal: ElementRef;

  welcomeModalConfig: NgbModalOptions = {
    backdrop: 'static',
    centered: true,
    keyboard: false,
  };

  constructor(private userInfoService: UserInfoService,
              private keyBoardShortcutService: KeyboardShortcutService,
              private modalService: NgbModal) { }

  ngOnInit() {
    if (!this.userInfoService.getNoMessage()) {
      this.openModal();
    }
  }
  // Fonctions d'ouverture et fermeture du modal
  openModal() {
    this.keyBoardShortcutService.modalWindowActive = true;
    this.modalService.open(this.welcomeModal, this.welcomeModalConfig);
  }

  closeModal() {
    this.keyBoardShortcutService.modalWindowActive = false;
    this.modalService.dismissAll();
  }

  // Fonction pour la verification du checkbox
  tickCheckBox(): void {
    this.userInfoService.tickCheckBox();
  }
}
