import {Component, Inject} from '@angular/core';
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {environment} from "../../../environments/environment";
import {DebugNfcComponent} from "../debug-nfc/debug-nfc.component";
import {MatButton} from "@angular/material/button";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle
} from "@angular/material/dialog";
import {NgIf} from "@angular/common";
import {Spool} from "../../model/spool";
import {MatIcon} from "@angular/material/icon";
import {SpoolCardComponent} from "../spool-card/spool-card.component";

@Component({
  selector: 'app-write-dialog',
  standalone: true,
  imports: [
    MatProgressSpinner,
    DebugNfcComponent,
    MatButton,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
    NgIf,
    MatIcon,
    SpoolCardComponent
  ],
  templateUrl: './write-dialog.component.html',
  styleUrl: './write-dialog.component.sass'
})
export class WriteDialogComponent {

  constructor(@Inject(MAT_DIALOG_DATA) private data: { spool: Spool }) {
    this.spool = data.spool;
  }

  protected spool: Spool;

  protected readonly environment = environment;
}
