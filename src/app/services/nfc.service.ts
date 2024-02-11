import {Injectable} from '@angular/core';
import {AsyncSubject, BehaviorSubject, Observable, of, Subject, throwError} from "rxjs";
import {Spool} from "../model/spool";
import {NfcEmulatorService} from "./nfc-emulator.service";
import {EmulatedNdefReader} from "../classes/emulated-ndef-reader";
import {environment} from "../../environments/environment";
import {MessageConverter} from "../classes/message-converter";
import {MatSnackBar} from "@angular/material/snack-bar";


@Injectable({
  providedIn: 'root'
})
export class NfcService {

  private ndef: NDEFReader;
  private converter = new MessageConverter();

  private statusSubject = new BehaviorSubject("Idle");

  private readSubject = new Subject<Spool>();
  private writing?: { id: string, message: NDEFMessageInit, subject: AsyncSubject<void> };

  constructor(private nfcEmulator: NfcEmulatorService, private snackBar: MatSnackBar) {
    // @ts-ignore
    this.ndef = environment.isDev ? new EmulatedNdefReader(this.nfcEmulator) : new NDEFReader();
    this.ndef.onreading = tag => this.handleReadWrite(tag);
    this.ndef.onreadingerror = err => this.handleError(err);

    this.ndef.scan()
      .then(() => {
        this.snackBar.open("Starting scan...", "Dismiss", {duration: 1000});
        this.statusSubject.next("Scanning");
      })
      .catch((e: Event) => {
        this.snackBar.open("Scan could not be started: " + e.type, "Dismiss", {duration: 1000});
        console.log("Scan could not be started: " + e.type);
        this.statusSubject.next("Error");
      });
  }

  public spool$(): Observable<Spool> {
    return this.readSubject;
  }

  public status$(): Observable<string> {
    return this.statusSubject;
  }

  public updateSpool(spool: Spool): Observable<void> {
    if (!this.writing) {
      this.statusSubject.next("Writing");

      this.writing = {
        id: spool.id,
        message: {records: this.converter.spoolToMessage(spool).records.map(r => r as NDEFRecordInit)},
        subject: new AsyncSubject<void>(),
      };

      return this.writing.subject;
    } else {
      return throwError(new Error("Already writing"));
    }
  }

  handleReadWrite(tag: NDEFReadingEvent) {
    if (!this.writing) {
      this.readSubject.next(this.converter.messageToSpool(tag.serialNumber, tag.message));
    }

    if (this.writing) {
      if (tag.serialNumber === this.writing.id) {
        this.ndef.write(this.writing.message, {overwrite: true})
          .then(() => {
            this.statusSubject.next("Reading");
            this.writing?.subject.complete();
            this.writing = undefined;
          })
          .catch((e) => {
            console.log(e);
            this.writing?.subject.error(new Error("Could not write tag, try again?"));
          })
          .finally();
      } else {
        this.snackBar.open("Not the correct tag, try again", "Dismiss", {duration: 1000});
      }
    }
  }

  handleError(error: Event) {
    console.log(error);
    this.snackBar.open("Error reading tag, try again?", "Dismiss", {duration: 1000});
  }

}
