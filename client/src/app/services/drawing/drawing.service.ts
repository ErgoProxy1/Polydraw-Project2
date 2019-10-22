import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { SVGPrimitive } from '../svgPrimitives/svgPrimitive';
import { Color } from '../utils/color';
import { NewDrawingInfo } from '../utils/newDrawingInfo';

@Injectable({
  providedIn: 'root',
})
export class DrawingService {

  drawingObservable: Observable<NewDrawingInfo>;
  drawingSubject  = new Subject<NewDrawingInfo>();

  initWorkspaceObservable: Observable<number[]>;
  initWorkspaceSubject = new BehaviorSubject<number[]>([0, 0]);

  workspaceObservable: Observable<number[]>;
  workspaceSubject = new BehaviorSubject<number[]>([0, 0]);

  primtivesObservable: Observable<SVGPrimitive[]>;
  primitivesSubject = new Subject<SVGPrimitive[]>();

  backgroundColorObservable: Observable<Color>;
  backgroundColorSubject = new Subject<Color>();

  constructor() {
    this.drawingObservable = this.drawingSubject.asObservable();
    this.initWorkspaceObservable = this.initWorkspaceSubject.asObservable();
    this.workspaceObservable = this.workspaceSubject.asObservable();
    this.primtivesObservable = this.primitivesSubject.asObservable();
    this.backgroundColorObservable = this.backgroundColorSubject.asObservable();
  }

  // Envoie les donnees du nouveau dessin au canvas
  sendDrawingData(newDrawingInfo: NewDrawingInfo): void {
    this.drawingSubject.next(newDrawingInfo);
  }

  // Envoir les donnees des dimensions du workspace à l'init de la vue
  sendInitWorkspaceDimensions(dimensions: number[]): void {
    this.initWorkspaceSubject.next(dimensions);
  }

  // Envoie les donnees des dimensions du workspace
  sendWorkspaceDimensions(dimensions: number[]): void {
    this.workspaceSubject.next(dimensions);
  }

  // Envoie la list des primitives presentent
  sendPrimitives(primitives: SVGPrimitive[]): void {
    this.primitivesSubject.next(primitives);
  }

  // Envoie les donnees de la couleur de fond
  sendBackgroundColorData(color: Color): void {
    this.backgroundColorSubject.next(color);
  }
}
