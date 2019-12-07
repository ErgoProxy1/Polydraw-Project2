import { Component, ElementRef, ViewChild } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { merge, Observable, Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { CanvasControllerService } from 'src/app/services/canvasController/canvas-controller.service';
import { DrawingHandlerService } from 'src/app/services/drawingHandler/drawing-handler.service';
import { KeyboardService } from 'src/app/services/keyboard/keyboard.service';
import { MessageHandlerService } from 'src/app/services/messageHandler/message-handler.service';
import { PrimitiveFactoryService } from 'src/app/services/primitivesFactory/primitive-factory.service';
import { SVGPrimitive } from 'src/app/services/svgPrimitives/svgPrimitive';
import { TagHandlerService } from 'src/app/services/tagHandler/tag-handler.service';
import { Color } from 'src/app/services/utils/color';
import { KeyboardEventType, KeyboardShortcutType, MessageType } from 'src/app/services/utils/constantsAndEnums';
import { NewDrawingInfo } from 'src/app/services/utils/newDrawingInfo';
import { DrawingInfo } from '../../../../../../common/communication/drawingInfo';
import { TagsInfo } from '../../../../../../common/communication/tags';

@Component({
  selector: 'app-open-gallery',
  templateUrl: './open-gallery.component.html',
  styleUrls: ['./open-gallery.component.scss'],
})

export class OpenGalleryComponent {
  keyboardServiceSubscription: Subscription;
  keyboardEventSubscription: Subscription;
  drawingsToShow: DrawingInfo[] = [];
  loading = false;
  // pour les tags
  currentTagInput = '';
  tagsSelected: TagsInfo[] = [];
  focus$ = new Subject<string>();
  click$ = new Subject<string>();
  limitToEight = true;
  limitToShow = 8;
  keyAdded = '';
  tagEntryActive = false;

  @ViewChild('galleryModal', { static: true }) galleryModal: ElementRef;

  galleryModalConfig: NgbModalOptions = {
    backdrop: 'static',
    size: 'lg',
    centered: true,
    keyboard: false,
  };

  constructor(private keyboardService: KeyboardService,
              private modalService: NgbModal,
              private controllerService: CanvasControllerService,
              private drawingHandler: DrawingHandlerService,
              private tagHandlerService: TagHandlerService,
              private primitiveFactory: PrimitiveFactoryService,
              private messageHandlerService: MessageHandlerService) {
    this.keyboardServiceSubscription = this.keyboardService.getKeyboardShortcutType().subscribe(
      (keyboardShortcut: KeyboardShortcutType) => {
        if (keyboardShortcut === KeyboardShortcutType.OpenGallery) {
          this.openModal();
        }
      });

    this.keyboardEventSubscription = this.keyboardService.getKeyboardEventType().subscribe(
      (keyboardEventType: KeyboardEventType) => {
        this.keyAdded = this.keyboardService.getKeyOut();
        this.keyboardEvent(keyboardEventType);
      });
  }

  keyboardEvent(keyboardEventType: KeyboardEventType): void {
    if (this.tagEntryActive && (this.keyAdded === 'Enter' || this.keyAdded === ' ')) {
      this.addNewTag();
    }
  }

  openModal(): boolean {
    this.drawingsToShow = [];
    this.loading = true;
    this.currentTagInput = '';
    this.tagsSelected = [];
    this.limitToEight = true;
    this.limitToShow = 8;

    this.loadDrawingsAndTags();

    this.keyboardService.modalWindowActive = true;
    this.modalService.open(this.galleryModal, this.galleryModalConfig);
    return this.modalService.hasOpenModals();
  }

  loadDrawingsAndTags(): void {
    this.drawingHandler.loadDrawings().then((success) => {
      if (!success) {
        this.messageHandlerService.showMessage('Erreur dans la tentative de récupération des dessins.', MessageType.Danger, 5000);
      }
      this.filterDrawings();
      this.loading = false;
    }).catch((error) => {
      this.messageHandlerService.showMessage(`Erreur de communication avec le server (loadDrawing) ERREUR: ${error}`,
                                              MessageType.Danger, 5000);
      this.loading = false;
    });
    this.tagHandlerService.loadTags().then((success) => {
      if (!success) {
        this.messageHandlerService.showMessage('Erreur dans la tentative de récupération des tags.', MessageType.Danger, 5000);
      }
      this.loading = false;
    }).catch((error) => {
      this.messageHandlerService.showMessage(`Erreur de communication avec le server (loadTags) ERREUR: ${error}`,
                                              MessageType.Danger, 5000);
      this.loading = false;
    });
  }

  readLocalFile(file: File): void {
    if (file && file.type === 'application/json') {
      this.loading = true;
      const fileLoader = new FileReader();
      fileLoader.readAsText(file);
      fileLoader.onload = () => {
        const unparsedFile = fileLoader.result as string;
        try {
          const unparsedDrawing: DrawingInfo = JSON.parse(unparsedFile);
          this.selectDrawing(unparsedDrawing);
        } catch (e) {
          if (!confirm('Fichier non valide. Veuillez réessayer.')) {
            this.setErrorInvalidFile();
            return;
          }
          this.loading = false;
        }
      };
      fileLoader.onerror = (error) => {
        if (!confirm('Fichier non valide. Veuillez réessayer.')) {
          this.setErrorInvalidFile();
          return;
        }
        this.loading = false;
      };
    } else {
      if (!confirm('Fichier non valide. Veuillez réessayer.')) {
        this.setErrorInvalidFile();
        return;
      }
    }
  }

  private setErrorInvalidFile(): void {
    this.messageHandlerService.showMessage('Erreur de fichier non valide, veuillez réessayer',
                                              MessageType.Danger, 5000);
  }

  deleteDrawing(drawing: DrawingInfo) {
    if (!confirm('Cette action supprimera le dessin de la galerie!')) {
      return;
    }
    this.loading = true;
    this.drawingHandler.deleteDrawing(drawing).then((success) => {
      this.messageHandlerService.showMessage('Dessin supprimé avec succès!',
                                                MessageType.Success, 5000);
      this.loading = false;
      this.drawingsToShow = [];
      this.loadDrawingsAndTags();
    }).catch((error) => {
      this.messageHandlerService.showMessage(`Erreur durant la suppression ERREUR: ${error}`,
                                                MessageType.Danger, 5000);
      this.loading = false;
    });
  }

  selectDrawing(drawing: DrawingInfo): void {
    if (drawing) {
      if (!this.controllerService.isEmptyPrimitives()) {
        if (!confirm('Cette action supprimera votre dessin actuel!')) {
          this.setErrorInvalidFile();
          return;
        }
      }
      const canvasInfo: NewDrawingInfo = JSON.parse(drawing.canvasInfo);
      canvasInfo.color = Color.copyColor(canvasInfo.color);
      this.controllerService.setCanvasInfo(canvasInfo);
      const primitives: SVGPrimitive[] = this.primitiveFactory.generatePrimitives(drawing.primitives);
      this.controllerService.setPrimitives(primitives);
      this.closeModal();
      this.messageHandlerService.showMessage('Ouverture réussie',
                                                MessageType.Success, 5000);
    } else {
      if (!confirm('L\'ouverture n\'a pas fonctionné. Veuillez réessayer.')) {
        this.messageHandlerService.showMessage('L\'ouverture n\'a pas fonctionné. Veuillez réessayer.',
                                                  MessageType.Danger, 5000);
        return;
      }
    }
  }

  getTagString(drawing: DrawingInfo): string {
    return this.tagHandlerService.convertTagSelectedToString(drawing.tags, this.tagsSelected);
  }

  addNewTag(): void {
    this.currentTagInput = this.currentTagInput.replace(/\s/g, ''); // enlève tous les espaces possibles
    if (this.currentTagInput.length !== 0 && this.currentTagInput.length < 30) {
      if (!this.tagHandlerService.isTagPresent(this.currentTagInput, this.tagsSelected)) {
        this.tagsSelected.push(this.tagHandlerService.getTag(this.currentTagInput));
        this.filterDrawings();
      }
      this.currentTagInput = '';
    } else {
      this.messageHandlerService.showMessage('Étiquette trop longue (maximum 30 caractères), veuillez réviser.',
                                                MessageType.Success, 5000);
    }
  }

  removeTag(tag: TagsInfo): void {
    const index: number = this.tagsSelected.indexOf(tag, 0);
    this.tagsSelected.splice(index, 1);
    this.filterDrawings();
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

  showMoreOrLess(): void {
    this.limitToShow = this.limitToEight ? 8 : this.drawingsToShow.length;
  }

  filterDrawings(): void {
    this.drawingsToShow = this.drawingHandler.filterDrawingsByTags(this.tagsSelected);
  }

  closeModal(): boolean {
    this.keyboardService.modalWindowActive = false;
    this.modalService.dismissAll();
    return this.modalService.hasOpenModals();
  }
}
