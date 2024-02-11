import {MatSnackBar} from "@angular/material/snack-bar";

export class Utils {

  public static showToast(snackbar: MatSnackBar, message: string, action: string, timeout: number): void {
    setTimeout(() => {
      snackbar.open(message, action, timeout ? {duration: timeout} : undefined);
    }, 10);
  }

}
