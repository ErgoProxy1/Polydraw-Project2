import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { KeyboardShortcutService } from 'src/app/services/keyboardShortcut/keyboard-shortcut.service';
import { WelcomeModalContentService } from 'src/app/services/welcomeModalContent/welcome-modal-content.service';
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
              private modalService: NgbModal,
              private welcomeModalContentService: WelcomeModalContentService) { }

  ngOnInit() {
    if (!this.userInfoService.getnoMessage()) {
      this.openModal();
    }
  }

  // Fonctions d'ouverture et fermeture du modal
  openModal(): void {
    this.keyBoardShortcutService.setActiveModalStatus(true);
    this.modalService.open(this.welcomeModal, this.welcomeModalConfig);
  }

  closeModal(): void {
    this.keyBoardShortcutService.setActiveModalStatus(false);
    this.modalService.dismissAll();
  }

  // Fonctions pour le texte affiché dans le body et le footer
  getModalText(): string {
    return this.welcomeModalContentService.getWelcomeModalText();
  }

  checkIfFirst(): boolean {
    return this.welcomeModalContentService.checkIfFirst();
  }

  checkIfLast(): boolean {
    return this.welcomeModalContentService.checkIfLast();
  }

  changeTab(currentAction: string): void {
    if (currentAction === 'previous') {
      this.welcomeModalContentService.prevTab();
    } else if (currentAction === 'next') {
      this.welcomeModalContentService.nextTab();
    }
  }

  // Fonction pour la verification du checkbox
  tickCheckBox(): void {
    this.userInfoService.tickCheckBox();
  }
}
