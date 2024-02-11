import {Injectable, NgZone} from '@angular/core';
import {MatSnackBar} from "@angular/material/snack-bar";

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private zone: NgZone, private snackbar: MatSnackBar) {
  }

  public showToast(message: string, timeout?: number) {
    this.zone.run(() => {
      this.snackbar.open(message, "Dismiss", timeout ? {duration: timeout} : undefined);
    });
  }

}
