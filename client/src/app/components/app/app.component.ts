import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { DrawingService } from '../../services/drawing/drawing.service';
import { KeyboardShortcutService } from '../../services/keyboardShortcut/keyboard-shortcut.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {

  constructor(
              private keyboardShortcutService: KeyboardShortcutService, private drawingService: DrawingService,
              private detector: ChangeDetectorRef) {

    this.drawingService.sendInitWorkspaceDimensions(this.workspaceDimensions);
    this.drawingService.sendWorkspaceDimensions(this.workspaceDimensions);
  }
  readonly title: string = 'PolyDessin';

  workspaceDimensions: number[] = [];

  @ViewChild('workspace', { static: false }) workspace: ElementRef;

  @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    this.keyboardShortcutService.onKeyPress(event);
  }

  @HostListener('focusin', ['$event.target']) onfocusin(target: HTMLInputElement) {
    if (target.type === 'number' || target.type === 'text') {
      this.keyboardShortcutService.inputFocusedActive = true;
    } else if (target.type === 'submit' || !target.type) {
      this.keyboardShortcutService.inputFocusedActive = false;
    }
  }

  @HostListener('focusout', ['$event']) onfocusout() {
    this.keyboardShortcutService.inputFocusedActive = false;
  }

  // Lit et envoie les dimensions de la zone de travail au component de nouveu dessin après l'init de la vue.
  // On retire 1 des valeurs parce que offset prend le padding et les marges externes en compte.
  ngAfterViewInit(): void {
    this.workspaceDimensions[0] = this.workspace.nativeElement.offsetWidth - 1;
    this.workspaceDimensions[1] = this.workspace.nativeElement.offsetHeight - 1;
    this.drawingService.sendInitWorkspaceDimensions(this.workspaceDimensions);
    this.detector.detectChanges();
  }

  // Lit et envoie les dimensions de la zone de travail au component de nouveu dessin.
  // On retire 1 des valeurs parce que offset prend le padding et les marges externes en compte.
  resendDimensions(): void {
    this.workspaceDimensions[0] = this.workspace.nativeElement.offsetWidth - 1;
    this.workspaceDimensions[1] = this.workspace.nativeElement.offsetHeight - 1;
    this.drawingService.sendWorkspaceDimensions(this.workspaceDimensions);
  }
}
