import {Injectable} from '@angular/core';
import {AsyncSubject, BehaviorSubject, Observable, Subject, throwError} from "rxjs";
import {Spool} from "../model/spool";
import {NfcEmulatorService} from "./nfc-emulator.service";
import {EmulatedNdefReader} from "../classes/emulated-ndef-reader";
import {environment} from "../../environments/environment";
import {MessageConverter} from "../classes/message-converter";
import {EngineStatus} from "../model/engine-status";
import {ToastService} from "./toast.service";


@Injectable({
  providedIn: 'root'
})
export class NfcService {

  private ndef: NDEFReader;
  private converter = new MessageConverter();

  private statusSubject = new BehaviorSubject<EngineStatus>("idle");

  private readSubject = new Subject<Spool>();
  private writing?: { id: string, message: NDEFMessageInit, subject: AsyncSubject<void> };

  constructor(private nfcEmulator: NfcEmulatorService, private toastService: ToastService) {
    // @ts-ignore
    this.ndef = environment.isDev ? new EmulatedNdefReader(this.nfcEmulator) : new NDEFReader();
    this.ndef.onreading = tag => this.handleReadWrite(tag);
    this.ndef.onreadingerror = err => this.handleError(err);
    this.startScan();
  }

  public spool$(): Observable<Spool> {
    return this.readSubject;
  }

  public status$(): Observable<EngineStatus> {
    return this.statusSubject;
  }

  public updateSpool(spool: Spool): Observable<void> {
    if (!this.writing) {
      this.statusSubject.next("writing");

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

  private handleReadWrite(tag: NDEFReadingEvent) {
    if (!this.writing) {
      this.readSubject.next(this.converter.messageToSpool(tag.serialNumber, tag.message));
    }

    if (this.writing) {
      if (tag.serialNumber === this.writing.id) {
        this.ndef.write(this.writing.message, {overwrite: true})
          .then(() => {
            this.statusSubject.next("reading");
            this.writing?.subject.next();
            this.writing?.subject.complete();
            this.writing = undefined;
          })
          .catch((e) => {
            console.log(e);
            this.writing?.subject.error(new Error("Could not write tag, try again?"));
          })
          .finally();
      } else {
        this.toastService.showToast("Not the correct tag, try again", 1000);
      }
    }
  }

  private handleError(error: Event) {
    console.log(error);
    this.toastService.showToast("Error reading tag, try again?", 1000);
  }

  public startScan() {
    this.ndef.scan()
      .then(() => {
        this.toastService.showToast("Starting scan...", 1000);
        this.statusSubject.next("reading");
      })
      .catch((e: Event) => {
        this.toastService.showToast("Scan could not be started: " + e, 1000);
        console.log("Scan could not be started", e);
        this.statusSubject.next("error");
      });
  }

  public cancelWrite() {
    if (this.writing) {
      this.statusSubject.next("reading");
      this.writing = undefined;
    }
  }

}
