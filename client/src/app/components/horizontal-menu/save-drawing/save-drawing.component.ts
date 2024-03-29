import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { merge, Observable, Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { CanvasControllerService } from 'src/app/services/canvasController/canvas-controller.service';
import { DrawingHandlerService } from 'src/app/services/drawingHandler/drawing-handler.service';
import { KeyboardService } from 'src/app/services/keyboard/keyboard.service';
import { MessageHandlerService } from 'src/app/services/messageHandler/message-handler.service';
import { TagHandlerService } from 'src/app/services/tagHandler/tag-handler.service';
import {
  KeyboardEventType, KeyboardShortcutType, MessageType, SAVING_TYPE_CHOICES,
  SavingType, SavingTypeInterface} from 'src/app/services/utils/constantsAndEnums';
import { DrawingInfo } from '../../../../../../common/communication/drawingInfo';
import { TagsInfo } from '../../../../../../common/communication/tags';

@Component({
  selector: 'app-save-drawing',
  templateUrl: './save-drawing.component.html',
  styleUrls: ['./save-drawing.component.scss'],
})

export class SaveDrawingComponent implements OnDestroy {
  tagEntryActive = false;
  keyAdded = '';
  keyboardEventSubscription: Subscription;
  keyboardSubscription: Subscription;
  htmlPrimitivesSubscription: Subscription;
  errorInForm = false;
  drawingInfo: DrawingInfo;
  tagsAllreadyExist = false;
  textSaveButton = 'Sauvegarder un dessin';
  loading = false;

  // Variables utiles pour le typeahead
  currentTagInput = '';
  tags: TagsInfo[];
  focus$ = new Subject<string>();
  click$ = new Subject<string>();

  typeOfSave: SavingTypeInterface[] = SAVING_TYPE_CHOICES;

  @ViewChild('saveDrawingModal', { static: true }) saveDrawingModal: ElementRef;

  saveDrawingModalConfig: NgbModalOptions = {
    backdrop: 'static',
    centered: true,
    keyboard: false,
  };

  constructor(private keyboardService: KeyboardService, private modalService: NgbModal,
              private controllerService: CanvasControllerService, private tagHandlerService: TagHandlerService,
              private drawingHandlerService: DrawingHandlerService,
              private messageHandlerService: MessageHandlerService) {
    this.textSaveButton = 'Sauvegarder un dessin';
    this.htmlPrimitivesSubscription = this.controllerService.getHTMLPrimitivesStringObservable().subscribe((primitives: string) => {
      this.drawingInfo.thumbnail = primitives;
    });
    this.keyboardSubscription = this.keyboardService.getKeyboardShortcutType().subscribe((
      keyboardShortcut: KeyboardShortcutType) => {
      if (keyboardShortcut === KeyboardShortcutType.SaveDrawing) {
        this.openModal();
      }
    });

    this.keyboardEventSubscription = this.keyboardService.getKeyboardEventType().subscribe(
      (keyboardEventType: KeyboardEventType) => {
        this.keyAdded = this.keyboardService.getKeyOut();
        this.keyboardEvent(keyboardEventType);
      });
  }

  ngOnDestroy(): void {
    this.keyboardSubscription.unsubscribe();
    this.htmlPrimitivesSubscription.unsubscribe();
  }

  keyboardEvent(keyboardEventType: KeyboardEventType) {
    if (this.tagEntryActive && (this.keyAdded === 'Enter' || this.keyAdded === ' ')) {
      this.addNewTag();
    }
  }

  checkErrorsInForm(): void {
    let tempError = false;
    if (this.drawingInfo.name.length === 0 || this.drawingInfo.name.length > 50) {
      tempError = true;
    }
    if (this.drawingInfo.typeOfSave < 0 || this.drawingInfo.typeOfSave > 1) {
      tempError = true;
    }
    for (const tag of this.drawingInfo.tags) {
      if (tag.id < -1 || tag.tagName.length === 0 || tag.tagName.length > 30) {
        tempError = true;
      }
    }
    this.errorInForm = tempError;
  }

  exportToServer(): void {
    this.drawingHandlerService.exportToServer(this.drawingInfo).then((msg) => {
      // Save successful
      if (msg === true) {
        this.textSaveButton = 'Sauvegarde réussie!';
        this.messageHandlerService.showMessage('Sauvegarde réussie!',
          MessageType.Success, 5000);
        this.closeModal();
      } else {
        // Erreur dans la sauvegarde
        this.messageHandlerService.showMessage('La sauvegarde a échoué!',
          MessageType.Danger, 5000);
      }
      this.loading = false;
    }, (error) => {
      this.messageHandlerService.showMessage(`La communication avec le serveur a échoué ERREUR: ${error}`,
        MessageType.Danger, 5000);
      this.loading = false;
    });
  }

  saveDrawing(): void {
    if (!this.loading) {
      if (this.drawingInfo.typeOfSave === SavingType.SaveOnServer) {
        this.loading = true;
        this.textSaveButton = 'Sauvegarde en cours...';
        this.exportToServer();
      } else if (this.drawingInfo.typeOfSave === SavingType.SaveLocally) {
        this.loading = true;
        this.textSaveButton = 'Sauvegarde en cours...';
        this.drawingHandlerService.exportDrawingLocally(this.drawingInfo);
        this.loading = false;
        this.messageHandlerService.showMessage('Sauvegarde réussie!',
          MessageType.Success, 5000);
        this.closeModal();
      }
    }
  }

  openModal(): boolean {
    this.loading = true;
    this.drawingInfo = {
      name: 'Nouveau Dessin',
      typeOfSave: 0,
      primitives: JSON.stringify(this.controllerService.svgPrimitives),
      tags: [],
      canvasInfo: JSON.stringify(this.controllerService.canvasInfo),
      thumbnail: '',
    };
    this.controllerService.getHTMLOfPrimitives();
    this.keyboardService.modalWindowActive = true;
    this.modalService.open(this.saveDrawingModal, this.saveDrawingModalConfig);
    this.loadTags();
    return this.modalService.hasOpenModals();
  }

  closeModal(): boolean {
    // On remet les valeurs par défaut
    this.keyboardService.modalWindowActive = false;
    this.loading = false;
    this.textSaveButton = 'Sauvegarder un dessin';
    this.modalService.dismissAll();
    return this.modalService.hasOpenModals();
  }

  loadTags(): void {
    this.tagHandlerService.loadTags().then((success) => {
      if (!success) {
        this.messageHandlerService.showMessage('Erreur dans la tentative de récupération des tags.',
          MessageType.Danger, 5000);
      }
      this.loading = false;
    }).catch((error) => {
      this.messageHandlerService.showMessage(`Erreur communication avec le serveur ERROR : ${error}`,
        MessageType.Danger, 5000);
      this.loading = false;
    });
  }

  // utile pour le typeahead des tags. Code pris de la library ng-bootstrap
  searchTagName = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(10), distinctUntilChanged());
    const inputFocus$ = this.focus$;
    return merge(debouncedText$, inputFocus$).pipe(
      map((inputValue) =>
        (this.tagHandlerService.filterTagsName(inputValue).slice(0, 10)),
      ),
    );
  }

  addNewTag(): void {
    // On enlève tous les espaces
    this.currentTagInput = this.currentTagInput.replace(/\s/g, ''); // enlève tous les espaces possibles
    if (this.currentTagInput.length !== 0 && this.currentTagInput.length < 30) {
      if (!this.tagHandlerService.isTagPresent(this.currentTagInput, this.drawingInfo.tags)) {
        this.drawingInfo.tags.push(this.tagHandlerService.getTag(this.currentTagInput));
      }
      this.currentTagInput = '';
    } else {
      this.messageHandlerService.showMessage('Étiquette trop longue (maximum 30 caractères), veuillez réviser.',
        MessageType.Danger, 5000);
    }
  }

  removeTag(tag: TagsInfo) {
    const index: number = this.drawingInfo.tags.indexOf(tag, 0);
    this.drawingInfo.tags.splice(index, 1);
  }
}
