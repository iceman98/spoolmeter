import {Injectable} from '@angular/core';
import {Observable, Subject} from "rxjs";
import {Spool} from "../model/spool";

@Injectable({
  providedIn: 'root'
})
export class NfcEmulatorService {

  private encoder = new TextEncoder();
  private decoder = new TextDecoder();

  private touchSubject = new Subject<NDEFReadingEvent>();
  private errorSubject = new Subject<Error>();

  private tags: Map<string, NDEFMessage> = new Map<string, NDEFMessage>(Object.entries({
    "123": {records: [{recordType: "text", data: this.getDataView("eryone|pla+|120|1000|1000")}]},
    "234": {records: [{recordType: "text", data: this.getDataView("anycubic|pla|150|1000|1000")}]}
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

  private getDataView(message: string): DataView {
    return new DataView(this.encoder.encode(message).buffer);
  }

  private getString(dataView: DataView): string {
    return this.decoder.decode(dataView);
  }

  public getSpools(): Spool[] {
    const spools: Spool[] = [];
    this.tags.forEach((v, k) => {
      if (v.records?.at(0)?.data) {
        const data = v.records?.at(0)?.data;
        if (data) {
          spools.push({id: k, material: this.getString(data)})
        }
      }
    });
    return spools;
  }

}
