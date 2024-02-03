import {Injectable} from '@angular/core';
import {AsyncSubject, Observable} from "rxjs";
import {Spool} from "../model/spool";
import {NfcEmulatorService} from "./nfc-emulator.service";
import {EmulatedNdefReader} from "../classes/emulated-ndef-reader";
import {environment} from "../../environments/environment";
import {MessageConverter} from "../classes/message-converter";


@Injectable({
  providedIn: 'root'
})
export class NfcService {

  private ndef: NDEFReader;
  private reading = false;
  private read = false;

  private writing = false;
  private written = false;

  private writingTo?: string;
  private writingBody?: NDEFMessageInit;

  private converter = new MessageConverter();

  private readSubject?: AsyncSubject<Spool>;
  private writeSubject?: AsyncSubject<void>;

  constructor(private nfcEmulator: NfcEmulatorService) {
    // @ts-ignore
    this.ndef = environment.isDev ? new EmulatedNdefReader(this.nfcEmulator) : new NDEFReader();
    this.ndef.onreading = tag => this.handleReadWrite(tag);
    this.ndef.onreadingerror = err => this.handleError(err);

    this.ndef.scan()
      .then(() => {
        console.log("Starting scan...");
      })
      .catch((e: Event) => {
        console.log("Scan could not be started: " + e.type);
      });
  }

  public readSpool(timeout: number): Observable<Spool> {
    this.readSubject = new AsyncSubject<Spool>();

    if (!this.reading) {
      this.reading = true;
      this.read = false;
      setTimeout(() => {
        if (!this.read) {
          console.warn("Timeout!");
          this.readSubject?.error("Read timed out");
        }
        this.reading = false;
        this.read = false;
      }, timeout);
    } else {
      console.warn("Read in progress!")
      this.readSubject.error("Already reading");
    }

    return this.readSubject;
  }

  public updateSpool(spool: Spool): Observable<void> {
    this.writeSubject = new AsyncSubject<void>();

    let message = this.converter.spoolToMessage(spool);

    const source: NDEFMessageInit = {
      records: message.records.map(r => {
        return {recordType: r.recordType, data: r.data} as NDEFRecordInit
      })
    };

    this.writing = true;
    this.writingTo = spool.id;
    this.writingBody = source;

    return this.writeSubject;
  }

  handleReadWrite(tag: NDEFReadingEvent) {
    if (this.reading && !this.read) {
      this.read = true;
      this.readSubject?.next(this.converter.messageToSpool(tag.serialNumber, tag.message));
      this.readSubject?.complete();
    }

    if (this.writing && !this.written && this.writingTo && this.writingBody) {
      if (tag.serialNumber === this.writingTo) {
        this.ndef.write(this.writingBody)
          .then(() => {
            this.written = true;
            this.writeSubject?.next();
            this.writeSubject?.complete();
          })
          .catch((e) => {
            console.log(e);
          })
          .finally();
      } else {
        console.log("This is not the tag we are waiting for");
      }
    }
  }

  handleError(error: Event) {
    console.error("Could not read tag: " + error.type);
  }

}
