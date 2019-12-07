import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { CanvasControllerService } from 'src/app/services/canvasController/canvas-controller.service';
import { MessageHandlerService } from 'src/app/services/messageHandler/message-handler.service';
import { ToolType } from 'src/app/services/utils/constantsAndEnums';
import { PopupMessage } from 'src/app/services/utils/popupMessage';
import { DrawingService } from '../../services/drawing/drawing.service';
import { KeyboardService } from '../../services/keyboard/keyboard.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit, OnDestroy {
  constructor(private keyboardService: KeyboardService, private drawingService: DrawingService,
              private detector: ChangeDetectorRef, private controller: CanvasControllerService,
              private messageHandlerService: MessageHandlerService) {
    this.messageHandlerSubscription = this.messageHandlerService.getPopupMessageObservable().subscribe((message) => {
      this.messageToshow = message;
      this.showMessage();
    });
    this.drawingService.sendInitWorkspaceDimensions(this.workspaceDimensions);
    this.drawingService.sendWorkspaceDimensions(this.workspaceDimensions);
  }

  private messageToshow: PopupMessage;
  popupMessage = '';
  isMessageToShow = false;
  typeOfMessage = '';
  messageHandlerSubscription: Subscription;
  readonly TITLE: string = 'PolyDessin';

  workspaceDimensions: number[] = [];

  @ViewChild('workspace', { static: false }) workspace: ElementRef;

  ngOnDestroy(): void {
    this.messageHandlerSubscription.unsubscribe();
  }

  @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    this.keyboardService.onKeyDown(event);
  }

  @HostListener('document:keyup', ['$event']) onKeyupHandler(event: KeyboardEvent) {
    this.keyboardService.onKeyUp(event);
  }

  @HostListener('focusin', ['$event.target']) onfocusin(target: HTMLInputElement) {
    if (target.type === 'number' || target.type === 'text') {
      this.keyboardService.inputFocusedActive = true;
    } else if (target.type === 'submit' || !target.type) {
      this.keyboardService.inputFocusedActive = false;
    }
  }

  @HostListener('focusout', ['$event']) onfocusout() {
    if (this.controller.tool.TYPE !== ToolType.TextTool) {
      this.keyboardService.inputFocusedActive = false;
    }
  }

  showMessage() {
    if (this.messageToshow &&  this.messageToshow.type) {
      this.typeOfMessage = this.messageToshow.type;
      this.popupMessage = this.messageToshow.message;
      this.isMessageToShow = true;
      setTimeout(() => this.isMessageToShow = false, this.messageToshow.durationInMS);
    }
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
