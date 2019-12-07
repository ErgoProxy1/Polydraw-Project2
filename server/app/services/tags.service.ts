import * as fs from 'fs';
import { injectable } from 'inversify';
import 'reflect-metadata';
import { TagsInfo } from '../../../common/communication/tags';

@injectable()
export class TagsService {
  readonly PATH = './data/tags.json';
  tags: TagsInfo[];

  constructor() {
    if (!fs.existsSync(this.PATH)) {
      // Le fichier doit être créé
      this.tags = [];
      fs.closeSync(fs.openSync(this.PATH, 'w'));
      fs.writeFile(this.PATH, '[]', () => {
        //
       });
    } else {
      // Le fichier existe
      const file = fs.readFileSync(this.PATH);
      this.tags = JSON.parse(file.toString());
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
      fs.writeFileSync(this.PATH, JSON.stringify(this.tags));
    }
    return tagIn;
  }

  // Méthode appelée pour gérer les tags d'un nouveau dessin
  manageNewTags(tagsIn: TagsInfo[]): TagsInfo[] {
    const tagsOut = [];
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
