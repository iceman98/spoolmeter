import {NfcEmulatorService} from "../services/nfc-emulator.service";

export class EmulatedNdefReader {

  constructor(private emulatorService: NfcEmulatorService) {
    emulatorService.getEvents().subscribe(this.handleTap);
    emulatorService.getErrors().subscribe(this.handleError);
  }

  public onreadingerror?: (event: any) => void;
  public onreading?: (event: any) => void;

  private state: "idle" | "scanning" | "writing" = "idle";

  public scan(options ?: NDEFScanOptions): Promise<any> {

    if (options) {
      options.signal.onabort = (event) => {
        this.state = "idle";
      }
    }

    if (this.state !== "idle") {
      return Promise.reject("Already scanning!");
    } else {
      this.state = "scanning";
      return Promise.resolve();
    }

  }

  public handleTap(event: NDEFReadingEvent): void {
    if (this.state === "scanning" && this.onreading) {
      this.onreading(event);
    }
  }

  public handleError(err: Error): void {
    if (this.state === "scanning" && this.onreadingerror) {
      this.onreadingerror(err);
    }
  }

}
