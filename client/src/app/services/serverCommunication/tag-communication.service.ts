import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { TagsInfo } from '../../../../../common/communication/tags';
import { SERVER_BASE_URL } from '../utils/constantsAndEnums';

@Injectable({
  providedIn: 'root',
})
export class TagCommunicationService {

  constructor(private http: HttpClient) { }

  getAllTags(): Observable<TagsInfo[]> {
    return this.http.get<TagsInfo[]>(SERVER_BASE_URL + '/tags/').pipe(
      catchError(this.handleError<TagsInfo>('getAllTags')),
      map((tags: TagsInfo[]) => {
        if (tags && tags.length !== 0) {
          tags.map((tag: TagsInfo) => {
            return {
              id: tag.id ? tag.id : '-1',
              value: tag.tagName ? tag.tagName : '',
            };
          });
        }
        return tags;
      }),
    );
  }

  private handleError<T>(request: string, result?: T): (error: Error) => Observable<T> {
    return (error: Error): Observable<T> => {
      return of(result as T);
    };
  }
}
