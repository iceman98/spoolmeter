import {Injectable} from '@angular/core';
import {Observable, Subject} from "rxjs";
import {Spool} from "../model/spool";
import {MessageConverter} from "../classes/message-converter";

@Injectable({
  providedIn: 'root'
})
export class NfcEmulatorService {

  private touchSubject = new Subject<NDEFReadingEvent>();
  private errorSubject = new Subject<Error>();
  private converter = new MessageConverter();

  private tags: Map<string, NDEFMessage> = new Map<string, NDEFMessage>(Object.entries({
    "empty!": this.converter.spoolToMessage({id: "empty!"}),
    "red": this.converter.spoolToMessage({id: "red", color: "#ff0000"})
  }));

  public getEvents(): Observable<NDEFReadingEvent> {
    return this.touchSubject;
  }

  public getErrors(): Observable<Error> {
    return this.errorSubject;
  }

  public touchTag(id: string): void {
    const event = new Event("reading") as any;
    event.serialNumber = id;
    event.message = this.tags.get(id);
    this.touchSubject.next(event);
  }

  public readError(message: string): void {
    this.errorSubject.next(new Error(message))
  }

  public getSpools(): Spool[] {
    const spools: Spool[] = [];

    this.tags.forEach((message, id) => {
      spools.push(this.converter.messageToSpool(id, message));
    });

    return spools;
  }


}
