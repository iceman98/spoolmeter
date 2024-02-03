import {Injectable} from '@angular/core';
import {AsyncSubject, Observable} from "rxjs";
import {Spool} from "../model/spool";
import {NfcEmulatorService} from "./nfc-emulator.service";
import {EmulatedNdefReader} from "../classes/emulated-ndef-reader";
import {environment} from "../../environments/environment";


@Injectable({
  providedIn: 'root'
})
export class NfcService {

  private ndef: NDEFReader;
  private reading = false;
  private read = false;

  private subject?: AsyncSubject<Spool>;

  constructor(private nfcEmulator: NfcEmulatorService) {
    // @ts-ignore
    this.ndef = environment.isDev ? new EmulatedNdefReader(this.nfcEmulator) : new NDEFReader();
    this.ndef.onreading = tag => this.handleReading(tag);
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
    this.subject = new AsyncSubject<Spool>();

    if (!this.reading) {
      this.reading = true;
      this.read = false;
      setTimeout(() => {
        if (!this.read) {
          console.warn("Timeout!");
          this.subject?.error("Read timed out");
        }
        this.reading = false;
        this.read = false;
      }, timeout);
    } else {
      console.warn("Read in progress!")
      this.subject.error("Already reading");
    }

    return this.subject;
  }

  handleReading(tag: NDEFReadingEvent) {
    if (this.reading && !this.read) {
      this.read = true;
      this.subject?.next({id: tag.serialNumber});
      this.subject?.complete();
    }
  }

  handleError(error: Event) {
    console.error("Could not read tag: " + error.type);
  }

}
