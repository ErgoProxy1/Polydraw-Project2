import * as fs from 'fs';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { DrawingInfo } from '../../../common/communication/drawingInfo';
import { TagsService } from '../services/tags.service';
import Types from '../types';
import { Image} from '../utils/image';
import { Metadata} from '../utils/metadata';
import {FirebaseService} from './firebase.service';
import {MongoService} from './mongo.service';

@injectable()
export class DrawingService {
  readonly PATH = './data/drawings.json';
  drawings: DrawingInfo[];
  mongoService: MongoService;
  firebaseService: FirebaseService;

  constructor(@inject(Types.TagsService) private tagsService: TagsService) {
    this.readFile();
    this.mongoService = new MongoService();
    this.firebaseService = new FirebaseService();

  }

  readFile() {
    if (!fs.existsSync(this.PATH)) {
      // Le fichier doit être créé
      this.drawings = [];
      fs.closeSync(fs.openSync(this.PATH, 'w'));
      fs.writeFile(this.PATH, '[]', () => {
        //
      });
    } else {
      this.drawings = [];
      // Le fichier existe
      const file = fs.readFileSync(this.PATH);
      this.drawings = JSON.parse(file.toString());
    }
  }

  getDrawings(): DrawingInfo[] | Error {
    this.readFile();
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
        fs.writeFileSync(this.PATH, JSON.stringify(this.drawings));
        return true;
      } else {
        // S'il n'y aucun dessin, on crée le fichier avec le nouveau dessin
        this.drawings.push(drawing);
        fs.writeFileSync(this.PATH, JSON.stringify(this.drawings));
        return true;
      }
    } catch (e) { return e; }
  }

  saveDrawingsOnCloud(): void {
    const fileName = 'drawings.json';
    const storageDirName = 'images';
    const image = new Image(this.PATH);
    this.addImagesInFirebaseAndMongoDB(image, storageDirName, fileName);
  }

  deleteDrawing(drawingToDelete: DrawingInfo): Error | boolean {
    this.readFile();
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
      fs.writeFileSync(this.PATH, JSON.stringify(this.drawings));
      return true;
    } catch (e) { return e; }
  }

  addImagesInFirebaseAndMongoDB(image: Image, storageDirName: string, fileName: string): Promise<void> {
    return  this.firebaseService.addImageBinary(image, fileName).then(() => {
      this.getUrl( storageDirName, fileName).then((url) => {
          if ( url && url !== undefined && url !== null) {
              image.metadata = new Metadata(fileName, new Date(Date.now()), url);
              this.mongoService.addMetadata(image.metadata);
          } else {
              console.log('url null !!');
          }
      });
    });
  }

  getUrl( storageDirName: string, fileName: string): Promise<string> {
    return  this.firebaseService.getImageUrl(storageDirName, fileName).then((requestUrl: string) => {
         if ( requestUrl && requestUrl !== undefined && requestUrl !== null) {
             return requestUrl;
         } else {
             return this.getUrl( storageDirName, fileName);
         }
     });
   }
}
