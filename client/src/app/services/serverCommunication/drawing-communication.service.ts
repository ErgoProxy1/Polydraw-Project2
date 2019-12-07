import { HttpClient } from '@angular/common/http';
import { ElementRef, Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { DrawingInfo } from '../../../../../common/communication/drawingInfo';
import { SERVER_BASE_URL } from '../utils/constantsAndEnums';

@Injectable({
  providedIn: 'root',
})
export class DrawingCommunicationService {

  svgHtmlElements: ElementRef;

  // Communication bi-directionelle entre la fenetre export et le canvas
  exportButtonObservable: Observable<boolean>;
  private exportButtonSubject = new Subject<boolean>();
  canvasObservable: Observable<string>;
  private canvasSubject = new Subject<string>();

  constructor(private http: HttpClient) {
    this.exportButtonObservable = this.exportButtonSubject.asObservable();
    this.canvasObservable = this.canvasSubject.asObservable();
  }

  sendSvgHtmlRequest(withGrid: boolean): void {
    this.exportButtonSubject.next(withGrid);
  }

  sendSvgHtml(svgData: string): void {
    this.canvasSubject.next(svgData);
  }

  getAllDrawings(): Observable<DrawingInfo[]> {
    return this.http.get<DrawingInfo[]>(SERVER_BASE_URL + '/drawing/').pipe(
      map((drawings: DrawingInfo[]) => {
        if (drawings && drawings.length !== 0) {
          drawings.map((drawing: DrawingInfo) => {
            return {
              name: drawing.name ? drawing.name : '',
              typeOfSave: drawing.typeOfSave ? drawing.typeOfSave : 0,
              canvasInfo: drawing.canvasInfo ? drawing.canvasInfo : '',
              tags: drawing.tags ? drawing.tags : [],
              primitives: drawing.primitives ? drawing.primitives : '',
              thumbnail: drawing.thumbnail ? drawing.thumbnail : '',
            };
          });
        }
        return drawings;
      }),
    );
  }

  saveDrawing(drawingInfo: DrawingInfo): Observable<any> {
    return this.http.post(SERVER_BASE_URL + '/drawing/save', {drawingInfo});
  }

  deleteDrawing(drawingInfo: DrawingInfo): Observable<any> {
    return this.http.post(SERVER_BASE_URL + '/drawing/delete', {drawingInfo});
  }
}
