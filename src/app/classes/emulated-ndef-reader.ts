import {NfcEmulatorService} from "../services/nfc-emulator.service";

export class EmulatedNdefReader implements NDEFReader {

  private state: "idle" | "scanning" = "idle";

  constructor(private emulatorService: NfcEmulatorService) {
    emulatorService.getEvents().subscribe({next: tag => this.handleTap(tag)});
    emulatorService.getErrors().subscribe({next: err => this.handleError(err)});
  }

  public onreading: (this: this, event: NDEFReadingEvent) => any = (e: NDEFReadingEvent) => null;
  public onreadingerror: (this: this, error: Event) => any = (e: Event) => null;

  addEventListener(type: string, callback: EventListenerOrEventListenerObject | null, options?: boolean | AddEventListenerOptions | undefined): void {
    throw new Error("Method not implemented.");
  }

  dispatchEvent(event: Event): boolean {
    throw new Error("Method not implemented.");
  }

  removeEventListener(type: string, callback: EventListenerOrEventListenerObject | null, options?: boolean | EventListenerOptions | undefined): void {
    throw new Error("Method not implemented.");
  }

  public scan(): Promise<any> {
    if (this.state === "idle") {
      this.state = "scanning";
      return Promise.resolve();
    } else {
      return Promise.reject(new Error("Already scanning!"));
    }
  }

  public write(message: NDEFMessageSource, options?: NDEFWriteOptions): Promise<void> {
    return Promise.resolve();
  }

  public makeReadOnly(options?: NDEFMakeReadOnlyOptions): Promise<void> {
    return Promise.resolve();
  }

  private handleTap(event: NDEFReadingEvent): void {
    if (this.state === "scanning" && this.onreading) {
      this.onreading(event);
    }
  }

  private handleError(err: Error): void {
    if (this.state === "scanning" && this.onreadingerror) {
      this.onreadingerror(new Event("error scanning: " + err.message));
    }
  }

}
