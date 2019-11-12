import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { DrawingInfo } from '../../../common/communication/drawingInfo';
import { TagsService } from '../services/tags.service';
import Types from '../types';

@injectable()
export class DrawingService {
  // tslint:disable-next-line: no-require-imports
  private fs = require('fs');
  readonly path = './data/drawings.json';
  drawings: DrawingInfo[];

  constructor(@inject(Types.TagsService) private tagsService: TagsService) {
    if (!this.fs.existsSync(this.path)) {
      // Le fichier doit être créé
      this.drawings = [];
      this.fs.closeSync(this.fs.openSync(this.path, 'w'));
      // tslint:disable-next-line: no-empty
      this.fs.writeFile(this.path, '[]', () => {});
    } else {
      // Le fichier existe
      const file = this.fs.readFileSync(this.path);
      this.drawings = JSON.parse(file);
    }
  }

  getDrawings(): DrawingInfo[] | Error {
    try {
      if (this.drawings.length !== 0) {
        return this.drawings;
      } else { return []; }
    } catch (e) { return e; }
  }

  saveDrawing(drawing: DrawingInfo): Error | boolean {
    try {
      // Validation du nom et des tags
      if (drawing.name.length === 0 || drawing.name.length > 50) {
        throw new Error('Veuillez entrer un nom SVP.');
      } else if (!this.tagsService.validateTags(drawing.tags)) {
        throw new Error('Veuillez vérifier les étiquettes SVP.');
      }
      // On trie d'abord les nouveaux tags
      drawing.tags = this.tagsService.manageNewTags(drawing.tags);
      // Si le tableau existe
      if (this.drawings.length !== 0) {
        this.drawings.push(drawing);
        this.fs.writeFileSync(this.path, JSON.stringify(this.drawings));
        return true;
      } else {
        // S'il n'y aucun dessin, on crée le fichier avec le nouveau dessin
        this.drawings.push(drawing);
        this.fs.writeFileSync(this.path, JSON.stringify(this.drawings));
        return true;
      }
    } catch (e) { return e; }
  }

  deleteDrawing(drawingToDelete: DrawingInfo): Error | boolean {
    try {
      const drawingsToReturn: DrawingInfo[] = [];
      for (const drawing of this.drawings) {
        if (drawing.name !== drawingToDelete.name) {
          drawingsToReturn.push(drawing);
        } else if (drawing.primitives !== drawingToDelete.primitives) {
          drawingsToReturn.push(drawing);
        }
      }
      this.drawings = drawingsToReturn;
      this.fs.writeFileSync(this.path, JSON.stringify(this.drawings));
      return true;
    } catch (e) { return e; }
  }
}
