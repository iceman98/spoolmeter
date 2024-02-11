import {Component} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {NfcService} from "../../services/nfc.service";

@Component({
  selector: 'app-permission-dialog',
  standalone: true,
  imports: [
    MatButton,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle
  ],
  templateUrl: './permission-dialog.component.html',
  styleUrl: './permission-dialog.component.sass'
})
export class PermissionDialogComponent {

  constructor(private nfcService: NfcService, private dialogRef: MatDialogRef<PermissionDialogComponent>) {
  }

  protected scan() {
    const reader = new NDEFReader();
    const abort = new AbortController();
    reader.scan({signal: abort.signal}).then(() => {
      abort.abort();
      this.dialogRef.close();
      this.nfcService.startScan();
    })
  }

}
