import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { SVGPrimitive } from '../svgPrimitives/svgPrimitive';
import { Color } from '../utils/color';
import { NewDrawingInfo } from '../utils/newDrawingInfo';

@Injectable({
  providedIn: 'root',
})
export class DrawingService {

  drawingObserver: Observable<NewDrawingInfo>;
  drawingSubject  = new Subject<NewDrawingInfo>();

  initWorkspaceObserver: Observable<number[]>;
  initWorkspaceSubject = new BehaviorSubject<number[]>([0, 0]);

  workspaceObserver: Observable<number[]>;
  workspaceSubject = new BehaviorSubject<number[]>([0, 0]);

  primtivesObserver: Observable<SVGPrimitive[]>;
  primitivesSubject = new Subject<SVGPrimitive[]>();

  backgroundColorObserver: Observable<Color>;
  backgroundColorSubject = new Subject<Color>();

  constructor() {
    this.drawingObserver = this.drawingSubject.asObservable();
    this.initWorkspaceObserver = this.initWorkspaceSubject.asObservable();
    this.workspaceObserver = this.workspaceSubject.asObservable();
    this.primtivesObserver = this.primitivesSubject.asObservable();
    this.backgroundColorObserver = this.backgroundColorSubject.asObservable();
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
