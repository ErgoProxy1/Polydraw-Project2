import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { DrawingInfo } from '../../../../../common/communication/drawingInfo';
import { SERVER_BASE_URL } from '../utils/constantsAndEnums';

@Injectable({
  providedIn: 'root',
})
export class DrawingCommunicationService {

  constructor(private http: HttpClient) { }

  getAllDrawings(): Observable<DrawingInfo[]> {
    return this.http.get<DrawingInfo[]>(SERVER_BASE_URL + '/drawing/').pipe(
      catchError(this.handleError<DrawingInfo>('getAllDrawings')),
      map((drawings: DrawingInfo[]) => {
        if (drawings && drawings.length !== 0) {
          drawings.map((drawing: DrawingInfo) => {
            return {
              name: drawing.name ? drawing.name : '',
              typeOfSave: drawing.typeOfSave ? drawing.typeOfSave : 0,
              canvasInfo: drawing.canvasInfo ? drawing.canvasInfo : '',
              tags: drawing.tags ? drawing.tags : [],
              primitives: drawing.primitives ? drawing.primitives : '',
            };
          });
        }
        return drawings;
      }),
    );
  }

  saveDrawing(drawingInfo: DrawingInfo): Observable<any> {
    return this.http.post(SERVER_BASE_URL + '/drawing/save', {drawingInfo}).pipe(
      catchError(this.handleError<any>('SaveDrawing')),
    );
  }

  private handleError<T>(request: string, result?: T): (error: Error) => Observable<T> {
    return (error: Error): Observable<T> => {
      return of(result as T);
    };
  }
}
