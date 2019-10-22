import { injectable } from 'inversify';
import 'reflect-metadata';
import { TagsInfo } from '../../../common/communication/tags';

@injectable()
export class TagsService {
  private fs = require('fs');
  readonly path = './data/tags.json';
  tags: TagsInfo[];

  constructor() {
    if (!this.fs.existsSync(this.path)) {
      // Le fichier doit être créé
      this.tags = [];
      this.fs.closeSync(this.fs.openSync(this.path, 'w'));
      this.fs.writeFile(this.path, '[]', () => { });
    } else {
      // Le fichier existe
      let file = this.fs.readFileSync(this.path);
      this.tags = JSON.parse(file);
    }
  }

  // Getter
  getTags(): TagsInfo[] | Error {
    try {
      if (this.tags.length !== 0) {
        return this.tags;
      } else { return []; }
    } catch (e) { return e; }
  }

  // Méthode pour gérer un tag ajouté à la fois
  addTag(tagIn: TagsInfo): TagsInfo {
    // N'existe pas déjà
    if (tagIn.id === -1) {
      tagIn.id = this.tags.length;
      this.tags.push(tagIn);
      this.fs.writeFileSync(this.path, JSON.stringify(this.tags));
    }
    return tagIn;
  }

  // Méthode appelée pour gérer les tags d'un nouveau dessin
  manageNewTags(tagsIn: TagsInfo[]): TagsInfo[] {
    let tagsOut = [];
    // Tous les tags en entrée
    for (const tag of tagsIn) {
      if (tag.id !== -1) {
        // Pas nouveau
        tagsOut.push(tag);
      } else {
        // Un nouveau tag
        tagsOut.push(this.addTag(tag));
      }
    }
    return tagsOut;
  }

  validateTags(tagsIn: TagsInfo[]): boolean {
    let validated = true;
    for (const tag of tagsIn) {
      if (tag.id < -1 || tag.tagName.length === 0) { validated = false; }
    }
    return validated;
  }
}
