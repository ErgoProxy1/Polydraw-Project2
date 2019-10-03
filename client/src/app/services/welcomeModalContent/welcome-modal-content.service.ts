import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class WelcomeModalContentService {
  currentTab = 0;
  readonly welcomeModalText: string[] = [
    'Une application développée par Samuel Charbonneau, Nourou-Dine Ahohoue, Jaafar Kaoussarani, \
    Louis-Philippe Lafontaine-Bédard, Éric Le Texier et Jean-Olivier Dalphond. Vous pouvez trouver \
    le guide d\'utilisation en tout temps en cliquant sur l\'icône en haut à droite. Ce site utilise des cookies.',
    'Vous pouvez retrouver ce menu de première visite en fermant complètement votre navigateur et en ouvrant de \
    nouveau cette page. Nous espérons que ce logiciel vous plaira. Maintenant, soyez créatif!'];

  getWelcomeModalText(): string {
    return this.welcomeModalText[this.currentTab];
  }

  nextTab(): void {
    this.currentTab++;
  }

  prevTab(): void {
    this.currentTab--;
  }

  checkIfFirst(): boolean {
    if (this.currentTab === 0) {
      return true;
    } else { return false; }
  }

  checkIfLast(): boolean {
    return this.currentTab >= this.welcomeModalText.length - 1;
  }
}
