import { Component, ElementRef, ViewChild } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { merge, Observable, Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { ControllerService } from 'src/app/services/controller/controller.service';
import { KeyboardShortcutService } from 'src/app/services/keyboardShortcut/keyboard-shortcut.service';
import { DrawingCommunicationService } from 'src/app/services/serverCommunication/drawing-communication.service';
import { TagCommunicationService } from 'src/app/services/serverCommunication/tag-communication.service';
import { Ellipse } from 'src/app/services/svgPrimitives/ellipse/ellispe';
import { Line } from 'src/app/services/svgPrimitives/line/line';
import { Path } from 'src/app/services/svgPrimitives/path/path';
import { Polygon } from 'src/app/services/svgPrimitives/polygon/polygon';
import { Rectangle } from 'src/app/services/svgPrimitives/rectangle/rectangle';
import { Stamp } from 'src/app/services/svgPrimitives/stamp/stamp';
import { SVGPrimitive } from 'src/app/services/svgPrimitives/svgPrimitive';
import { Color } from 'src/app/services/utils/color';
import { ENTER_KEY_CODE, KeyboardShortcutType, PrimitiveType, SPACE_KEY_CODE } from 'src/app/services/utils/constantsAndEnums';
import { NewDrawingInfo } from 'src/app/services/utils/newDrawingInfo';
import { DrawingInfo } from '../../../../../../common/communication/drawingInfo';
import { TagsInfo } from '../../../../../../common/communication/tags';

@Component({
  selector: 'app-open-gallery',
  templateUrl: './open-gallery.component.html',
  styleUrls: ['./open-gallery.component.scss'],
})
export class OpenGalleryComponent {
  subscription: Subscription;
  // TODO: changer cette fonction pour obtenir les dessins de l'utilisateur/galerie
  drawings: DrawingInfo[] = [];
  drawingsToShow: DrawingInfo[] = [];
  loading = false;
  // pour les tags
  currentTagInput = '';
  allTags: TagsInfo[];
  tagsName: string[] = [];
  tagsSelected: TagsInfo[] = [];
  focus$ = new Subject<string>();
  click$ = new Subject<string>();
  limitToEight = true;
  limitToShow = 8;

  @ViewChild('galleryModal', { static: true }) galleryModal: ElementRef;

  galleryModalConfig: NgbModalOptions = {
    backdrop: 'static',
    size: 'lg',
    centered: true,
    keyboard: false,
  };

  constructor(private keyboardShortcutService: KeyboardShortcutService,
              private modalService: NgbModal,
              private controllerService: ControllerService, /* private tagCommunicationService: TagCommunicationService,*/
              private drawingCommunicationService: DrawingCommunicationService,
              private tagCommunicationService: TagCommunicationService) {
    this.subscription = this.keyboardShortcutService.getKeyboardShortcutType().subscribe((keyboardShortcut: KeyboardShortcutType) => {
      if (keyboardShortcut === KeyboardShortcutType.OpenGallery) {
        this.openModal();
      }
    });
  }

  // Ouvre la fenêtre modal quand le bouton ou CTRL+s est appuyé
  openModal(): boolean {
    // reset les variables
    this.drawings = [];
    this.drawingsToShow = [];
    this.loading = true;
    this.currentTagInput = '';
    this.allTags = [];
    this.tagsName = [];
    this.tagsSelected = [];
    this.limitToEight = true;
    this.limitToShow = 8;

    this.loadDrawingsAndTags();

    this.keyboardShortcutService.modalWindowActive = true;
    this.modalService.open(this.galleryModal, this.galleryModalConfig);
    return this.modalService.hasOpenModals();
  }
  loadDrawingsAndTags() {
    this.drawingCommunicationService.getAllDrawings().subscribe((drawings: DrawingInfo[]) => {
      if (drawings) {
        this.drawings = drawings;
        this.drawingsToShow = this.drawings;
      }
      this.tagCommunicationService.getAllTags().subscribe((tags: TagsInfo[]) => {
        this.allTags = (tags && tags.length !== 0) ? tags : [];
        this.tagsName = [];
        this.allTags.forEach((tag) => {
          this.tagsName.push(tag.tagName);
        });
        this.loading = false;
      });
    });
  }

  // Ferme la fenêtre modal
  closeModal(): boolean {
    this.keyboardShortcutService.modalWindowActive = false;
    this.modalService.dismissAll();
    return this.modalService.hasOpenModals();
  }

  // Méthodes pour configurer les input boxes et les shortcuts
  setInactiveFocus() {
    this.keyboardShortcutService.inputFocusedActive = false;
  }

  setActiveFocus() {
    this.keyboardShortcutService.inputFocusedActive = true;
  }

  getTagString(drawing: DrawingInfo): string {

    let msg: string;
    if (drawing.tags.length !== 0) {
      msg = 'Étiquettes: ';
      drawing.tags.forEach((tag) => {
        if (this.tagAllreadyExist(tag.tagName)) {
          msg += '<mark><b>' + tag.tagName + '</b></mark>, ';
        } else {
          msg += tag.tagName + ', ';
        }
      });
      // enlevons la dernière virgule
      msg = msg.slice(0, msg.length - 2);
    } else {
      msg = 'Aucune étiquette';
    }

    return msg;
  }

  selectDrawing(drawing: DrawingInfo) {
    if (drawing) {
      if (this.controllerService.getPrimitives().length !== 0) {
        if (!confirm('Cette action supprimera votre dessin actuel!')) {
          return;
        }
      }
      const canvasInfo: NewDrawingInfo = JSON.parse(drawing.canvasInfo);
      canvasInfo.color = Color.copyColor(canvasInfo.color);
      this.controllerService.setCanvasInfo(canvasInfo);
      const primitives: SVGPrimitive[] = [];
      const tabTemp: SVGPrimitive[] = JSON.parse(drawing.primitives);
      tabTemp.forEach((prim: SVGPrimitive) => {
        switch (prim.type) {
          case PrimitiveType.Rectangle: {
            const rectangle: Rectangle = Rectangle.createCopy(prim);
            primitives.push(rectangle);
            break;
          }
          case PrimitiveType.Path: {
            const path: Path = Path.createCopy(prim);
            primitives.push(path);
            break;
          }
          case PrimitiveType.Stamp: {
            const stamp: Stamp = Stamp.createCopy(prim);
            primitives.push(stamp);
            break;
          }
          case PrimitiveType.Line: {
            const line: Line = Line.createCopy(prim);
            primitives.push(line);
            break;
          }
          case PrimitiveType.Ellipse: {
            const ellipse: Ellipse = Ellipse.createCopy(prim);
            primitives.push(ellipse);
            break;
          }
          case PrimitiveType.Polygon: {
            const polygon: Polygon = Polygon.createCopy(prim);
            primitives.push(polygon);
            break;
          }
        }
      });
      this.controllerService.setPrimitives(primitives);
      this.closeModal();
    }
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
      let tagTemp = this.allTags.find((tag) => {
        return tag.tagName === this.currentTagInput;
      });
      if (!tagTemp) {
        tagTemp = {
          id: -1,
          tagName: this.currentTagInput,
        };
      }

      if (!this.tagAllreadyExist(this.currentTagInput)) {
        this.tagsSelected.push(tagTemp);
      }
      this.currentTagInput = '';
      this.filterDrawings();
    }
  }

  removeTag(tag: TagsInfo) {
    const index: number = this.tagsSelected.indexOf(tag, 0);
    this.tagsSelected.splice(index, 1);
    this.filterDrawings();
  }

  tagAllreadyExist(tagName: string): boolean {
    return (this.tagsSelected.find((tag) => {
      return tag.tagName === tagName;
    })) ? true : false;
  }

  showMoreOrLess() {
    this.limitToShow = this.limitToEight ? 8 : this.drawings.length;
  }

  filterDrawings() {
    this.drawingsToShow = [];
    if (!this.drawings) {
      this.drawingsToShow = [];
    } else if (!this.tagsSelected || this.tagsSelected.length === 0) {
      this.drawingsToShow = this.drawings;
    } else {

      for (const drawing of this.drawings) {
        const allTagsAreIn: boolean = this.tagsSelected.every((tagFilter) => {
          return drawing.tags.find((tag) => {
            return tagFilter.id === tag.id;
          }) ? true : false;
        }) ? true : false;
        if (allTagsAreIn) {
          this.drawingsToShow.push(drawing);
        }
      }

    }

  }
}
