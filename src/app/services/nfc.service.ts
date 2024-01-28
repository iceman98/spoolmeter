import {Injectable} from '@angular/core';
import {AsyncSubject, Observable, Subject} from "rxjs";
import {Spool} from "../model/spool";
import {NfcEmulatorService} from "./nfc-emulator.service";
import {EmulatedNdefReader} from "../classes/emulated-ndef-reader";
import {environment} from "../../environments/environment";


@Injectable({
  providedIn: 'root'
})
export class NfcService {

  private abortController = new AbortController();
  private status: "idle" | "scanning" | "writing" = "idle";

  constructor(private nfcEmulator: NfcEmulatorService) {
  }

  public readSpool(timeout: number): Observable<Spool> {
    const subject = new AsyncSubject<Spool>();

    const ndef = environment.isDev ? new EmulatedNdefReader(this.nfcEmulator) : new NDEFReader();

    if (this.status !== "idle") {
      this.error(subject, "Already scanning/reading");
    }

    ndef.onreadingerror = (event: any) => {
      this.error(subject, "Tag cannot be read");
    };

    ndef.onreading = (event: any) => {
      this.success(subject, this.getSpool(event.serialNumber, event.message), "Tag read!");
    };

    ndef.scan({signal: this.abortController.signal}).then(() => {
      console.log("Scan started successfully.");
    }).catch((error) => {
      this.error(subject, `Error! Scan failed to start: ${error}.`);
    });

    setTimeout(() => {
      this.abortController.abort("Timeout");
    }, timeout);

    return subject;
  }

  private getSpool(serialNumber: string, message: NDEFMessage): Spool {
    return {
      id: serialNumber,
      brand: "ERYONE",
      color: "red",
      material: "PLA",
      spoolWeight: 110,
      filamentWeight: 1000,
      remainingWeight: 1000
    };
  }

  private error(subject: Subject<Spool>, message: string) {
    console.log(message);
    subject.error(message);
  }

  private success(subject: Subject<Spool>, spool: Spool, message: string) {
    console.log(message, spool);
    subject.next(spool);
    subject.complete();
  }

}
