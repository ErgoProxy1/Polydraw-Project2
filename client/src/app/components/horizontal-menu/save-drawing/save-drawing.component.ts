import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { merge, Observable, Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { ControllerService } from 'src/app/services/controller/controller.service';
import { KeyboardShortcutService } from 'src/app/services/keyboardShortcut/keyboard-shortcut.service';
import { DrawingCommunicationService } from 'src/app/services/serverCommunication/drawing-communication.service';
import { TagCommunicationService } from 'src/app/services/serverCommunication/tag-communication.service';
// tslint:disable-next-line
import { ENTER_KEY_CODE, KeyboardShortcutType, SavingTypeChoice, SavingTypeInterface, SPACE_KEY_CODE } from 'src/app/services/utils/constantsAndEnums';
import { DrawingInfo } from '../../../../../../common/communication/drawingInfo';
import { TagsInfo } from '../../../../../../common/communication/tags';

@Component({
  selector: 'app-save-drawing',
  templateUrl: './save-drawing.component.html',
  styleUrls: ['./save-drawing.component.scss'],
})

export class SaveDrawingComponent implements OnDestroy {
  saveSuccessful = false;
  errorDuringSave = false;
  saveInProgress = false;
  keyboardSubscription: Subscription;
  htmlPrimitivesSubscription: Subscription;
  errorInForm = false;
  drawingInfo: DrawingInfo;
  tagsAllreadyExist = false;
  textSaveButton = 'Sauvegarder un dessin';
  loading = false;

  // variables utiles pour le typeahead
  currentTagInput = '';
  tags: TagsInfo[];
  tagsName: string[] = [];
  focus$ = new Subject<string>();
  click$ = new Subject<string>();

  typeOfSave: SavingTypeInterface[] = SavingTypeChoice;

  // primitives: SVGPrimitive[] = this.canvasComponent.primitives;

  @ViewChild('saveDrawingModal', { static: true }) saveDrawingModal: ElementRef;

  saveDrawingModalConfig: NgbModalOptions = {
    backdrop: 'static',
    centered: true,
    keyboard: false,
  };

  constructor(private keyboardShortcutService: KeyboardShortcutService, private modalService: NgbModal,
              private controllerService: ControllerService, private tagCommunicationService: TagCommunicationService,
              private drawingCommunicationService: DrawingCommunicationService) {
    this.textSaveButton = 'Sauvegarder un dessin';
    this.saveInProgress = false;
    this.errorDuringSave = false;
    this.htmlPrimitivesSubscription = this.controllerService.getHTMLPrimitivesStringObservable().subscribe( (primitives: string) => {
      this.drawingInfo.thumbnail = primitives;
    });
    this.keyboardSubscription = this.keyboardShortcutService.getKeyboardShortcutType().subscribe((
      keyboardShortcut: KeyboardShortcutType) => {
      if (keyboardShortcut === KeyboardShortcutType.SaveDrawing) {
        this.openModal();
      }
    });
  }

  ngOnDestroy(): void {
    this.keyboardSubscription.unsubscribe();
  }

  checkErrorsInForm() {
    let tempError = false;
    for (const tag of this.drawingInfo.tags) {
      if (tag.id < -1 || tag.tagName.length === 0) {
        tempError = true;
      }
    }
    // TODO: à modifier pour les prochains sprints où la sauvegarde locale sera permise
    if (this.drawingInfo.name.length === 0 || this.drawingInfo.typeOfSave !== 0) {
      tempError = true;
    }
    this.errorInForm = tempError;
  }

  saveDrawing(): void {
    if (!this.saveInProgress) {
      this.saveInProgress = true;
      this.textSaveButton = 'Sauvegarde en cours...';
      this.drawingCommunicationService.saveDrawing(this.drawingInfo).subscribe((msg) => {
        // Save successful
        if (msg === true) {
          this.textSaveButton = 'Sauvegarde réussie';
          this.saveSuccessful = true;
          setTimeout(() => this.saveSuccessful = false, 5000);
          this.closeModal();
        } else {
          // Erreur dans la sauvegarde
          this.errorDuringSave = true;
          this.saveInProgress = false;
          this.loading = false;
        }
        this.saveInProgress = false;
        this.loading = false;
      });
    }
  }

  // Ouvre la fenêtre modal quand le bouton ou CTRL+s est appuyé
  openModal(): boolean {
    this.saveInProgress = false;
    this.loading = false;
    this.errorDuringSave = false;
    // si drawing allready save prendre info
    this.drawingInfo = {
      name: 'Nouveau Dessin',
      typeOfSave: 0,
      primitives: JSON.stringify(this.controllerService.getPrimitives()),
      tags: [],
      canvasInfo: JSON.stringify(this.controllerService.canvasInfo),
      thumbnail: '',
    };
    this.controllerService.getHTMLOfPrimitives();

    this.keyboardShortcutService.modalWindowActive = true;
    this.modalService.open(this.saveDrawingModal, this.saveDrawingModalConfig);
    this.loadTags();
    return this.modalService.hasOpenModals();
  }

  // Ferme la fenêtre modal
  closeModal(): boolean {
    // On remet les valeurs par défaut
    this.keyboardShortcutService.modalWindowActive = false;
    this.modalService.dismissAll();
    this.saveInProgress = false;
    this.loading = false;
    this.textSaveButton = 'Sauvegarder un dessin';
    return this.modalService.hasOpenModals();
  }

  // Méthodes pour configurer les input boxes et les shortcuts
  setInactiveFocus() {
    this.keyboardShortcutService.inputFocusedActive = false;
  }

  setActiveFocus() {
    this.keyboardShortcutService.inputFocusedActive = true;
  }

  loadTags() {
    this.loading = true;
    this.tagCommunicationService.getAllTags().subscribe((tags: TagsInfo[]) => {
      this.tags = (tags && tags.length !== 0) ? tags : [];
      this.tagsName = [];
      this.tags.forEach((tag) => {
        this.tagsName.push(tag.tagName);
      });
      this.loading = false;
    });
  }

  // utile pour le typeahead des tags. Code pris de la library ng-bootstrap
  searchTagName = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(10), distinctUntilChanged());
    const inputFocus$ = this.focus$;

    return merge(debouncedText$, inputFocus$).pipe(
      map((inputValue) => (inputValue === '' ? this.tagsName
        : this.tagsName.filter((tagName) => tagName.toLowerCase().indexOf(inputValue.toLowerCase()) > -1)).slice(0, 10)),
    );
  }

  onKeyPressedTags(keyboard: KeyboardEvent) {
    if (keyboard.code === ENTER_KEY_CODE || keyboard.code === SPACE_KEY_CODE) {
      this.addNewTag();
    }
  }

  addNewTag() {
    this.currentTagInput = this.currentTagInput.replace(/\s/g, ''); // enlève tous les espaces possibles
    if (this.currentTagInput.length !== 0) {
      let tagTemp = this.tags.find((tag) => {
        return tag.tagName === this.currentTagInput;
      });
      if (!tagTemp) {
        tagTemp = {
          id: -1,
          tagName: this.currentTagInput,
        };
      }
      this.tagsAllreadyExist = (this.drawingInfo.tags.find((tag) => {
        return tag.tagName === this.currentTagInput;
      })) ? true : false;
      if (!this.tagsAllreadyExist) {
        this.drawingInfo.tags.push(tagTemp);
        this.currentTagInput = '';
      }
    }
  }

  removeTag(tag: TagsInfo) {
    const index: number = this.drawingInfo.tags.indexOf(tag, 0);
    this.drawingInfo.tags.splice(index, 1);
  }

}
