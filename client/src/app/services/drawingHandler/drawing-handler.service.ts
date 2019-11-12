import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { DrawingInfo } from '../../../../../common/communication/drawingInfo';
import { TagsInfo } from '../../../../../common/communication/tags';
import { DrawingCommunicationService } from '../serverCommunication/drawing-communication.service';
import { TagHandlerService } from '../tagHandler/tag-handler.service';

@Injectable({
  providedIn: 'root',
})
export class DrawingHandlerService {

  drawings: DrawingInfo[] = [];
  constructor(private drawingCommunicationService: DrawingCommunicationService, private tagHandlerService: TagHandlerService,
              private sanitizer: DomSanitizer) { }

  async loadDrawings(): Promise<boolean> {
    this.drawings = [];
    return new Promise((resolve, reject) => {
      this.drawingCommunicationService.getAllDrawings().subscribe((drawings: DrawingInfo[]) => {
        if (drawings && drawings.length !== 0) {
          this.drawings = drawings;
          resolve(true);
        } else {
          resolve(false);
        }
      }, () => {
        reject('Erreur de communication avec le server');
      });
    });
  }

  async exportToServer(drawing: DrawingInfo): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.drawingCommunicationService.saveDrawing(drawing).subscribe((success) => {
        if (success) {
          resolve(true);
        } else {
          resolve(false);
        }
      }, () => {
        reject('Erreur de communication avec le server');
      });
    });
  }

  exportDrawingLocally(drawing: DrawingInfo): void {
    const file = new Blob([JSON.stringify(drawing)]);
    const a = document.createElement('a');
    a.href = URL.createObjectURL(file);
    this.sanitizer.bypassSecurityTrustUrl(a.href);
    a.download = drawing.name + '.json';
    document.body.appendChild(a);
    a.click();
  }

  // TODO SPRINT 4
  // async deleteDrawing(drawing: DrawingInfo): Promise<boolean> {
  //   return new Promise((resolve, reject) => {
  //     this.drawingCommunicationService.deleteDrawing(drawing).subscribe((success: boolean) => {
  //       if (success) {
  //         resolve(true);
  //       } else {
  //         resolve(false);
  //       }
  //     }, () => {
  //       reject('Erreur de communication avec le server');
  //     });
  //   });
  // }

  filterDrawingsByTags(tags: TagsInfo[]): DrawingInfo[] {
    let drawingsToShow: DrawingInfo[] = [];
    if (!this.drawings) {
      drawingsToShow = [];
    } else if (!tags || tags.length === 0) {
      drawingsToShow = this.drawings;
    } else {
      for (const drawing of this.drawings) {
        if (this.tagHandlerService.areAllTagPresent(tags, drawing.tags)) {
          drawingsToShow.push(drawing);
        }
      }
    }
    return drawingsToShow;
  }
}
