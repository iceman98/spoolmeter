import {Component} from '@angular/core';
import {MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle} from "@angular/material/dialog";
import {MatButton} from "@angular/material/button";
import {NfcService} from "../../services/nfc.service";

@Component({
  selector: 'app-help-dialog',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButton,
    MatDialogClose
  ],
  templateUrl: './help-dialog.component.html',
  styleUrl: './help-dialog.component.sass'
})
export class HelpDialogComponent {

  constructor(private nfcService: NfcService) {
  }

  protected scan() {
    const reader = new NDEFReader();
    const abort = new AbortController();
    reader.scan({signal: abort.signal}).then(() => {
      abort.abort();
      this.nfcService.startScan();
    })
  }

}
