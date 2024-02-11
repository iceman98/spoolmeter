import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, of, Subject} from "rxjs";
import {Spool} from "../model/spool";
import {MessageConverter} from "../classes/message-converter";

@Injectable({
  providedIn: 'root'
})
export class NfcEmulatorService {

  private touchSubject = new Subject<NDEFReadingEvent>();
  private errorSubject = new Subject<Error>();
  private converter = new MessageConverter();

  private spools = new BehaviorSubject<Spool[]>([]);

  constructor() {
    this.updateSpools();
  }

  private tags: Map<string, NDEFMessage> = new Map<string, NDEFMessage>(Object.entries({
    "{new}": this.converter.spoolToMessage({id: "{new}"}),
    "{empty}": this.converter.spoolToMessage({id: "{empty}", signature: "ic_v1"}),
    "{named}": this.converter.spoolToMessage({id: "{named}", signature: "ic_v1", name: "named"}),
    "{colored}": this.converter.spoolToMessage({id: "{colored}", signature: "ic_v1", color: "#ff0000"}),
    "{complete}": this.converter.spoolToMessage({
      id: "{complete}",
      signature: "ic_v1",
      name: "complete",
      brand: "JAYO",
      material: "PLA+",
      color: "#ff0000",
      temperature: 220,
      flowFactor: 0.02,
      spoolWeight: 120,
      initialFilamentWeight: 1100,
      remainingFilamentWeight: 750
    }),
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

  public spools$(): Observable<Spool[]> {
    return this.spools;
  }

  public addSpool(spool: Spool) {
    this.tags.set(spool.id, this.converter.spoolToMessage(spool));
    this.updateSpools();
  }

  protected updateSpools() {
    const spools: Spool[] = [];

    this.tags.forEach((message, id) => {
      spools.push(this.converter.messageToSpool(id, message));
    });

    this.spools.next(spools);
  }

  public remove(id: string) {
    this.tags.delete(id);
    this.updateSpools();
  }

}
