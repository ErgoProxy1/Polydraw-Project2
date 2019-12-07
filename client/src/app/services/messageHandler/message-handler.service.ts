import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { MESSAGE_TYPE_MAP, MessageType } from '../utils/constantsAndEnums';
import { PopupMessage } from '../utils/popupMessage';

@Injectable({
  providedIn: 'root',
})

export class MessageHandlerService {
  private readonly POPUP_MESSAGE_SUBJECT: Subject<PopupMessage>;

  constructor() {
    this.POPUP_MESSAGE_SUBJECT = new Subject<PopupMessage>();
  }

  getPopupMessageObservable(): Observable<PopupMessage> {
    return this.POPUP_MESSAGE_SUBJECT.asObservable();
  }

  showMessage(message: string, messageType: MessageType, durationInMS: number) {
    const messageToShow: PopupMessage = {
      message,
      type: MESSAGE_TYPE_MAP.get(messageType),
      durationInMS,
    };
    this.POPUP_MESSAGE_SUBJECT.next(messageToShow);
  }
}
