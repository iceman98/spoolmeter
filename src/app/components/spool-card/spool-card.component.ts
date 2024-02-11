import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Spool} from "../../model/spool";
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle
} from "@angular/material/card";
import {MatSuffix} from "@angular/material/form-field";
import {NgxColorsModule} from "ngx-colors";
import {FormsModule} from "@angular/forms";
import {MatIcon} from "@angular/material/icon";
import {MatButton} from "@angular/material/button";
import {MatDialog} from "@angular/material/dialog";
import {EditDialog} from "../edit-dialog/edit-dialog.component";

@Component({
  selector: 'app-spool-card',
  standalone: true,
  imports: [
    MatCardTitle,
    MatCard,
    MatSuffix,
    NgxColorsModule,
    FormsModule,
    MatIcon,
    MatCardHeader,
    MatCardContent,
    MatCardActions,
    MatCardSubtitle,
    MatButton
  ],
  templateUrl: './spool-card.component.html',
  styleUrl: './spool-card.component.sass'
})
export class SpoolCardComponent {

  @Input()
  spool: Spool | undefined;

  @Input()
  readOnly = false;

  @Output()
  cardRemoved = new EventEmitter<void>();

  @Output()
  cardUpdated = new EventEmitter<Spool>();

  constructor(private dialog: MatDialog) {
  }

  protected edit() {
    const spool = {...this.spool} as Spool;
    const dialog = this.dialog.open(EditDialog, {data: {spool}, disableClose: true});
    dialog.afterClosed().subscribe({
      next: r => {
        if (r === "update") {
          this.update(spool);
        }
      }
    });
  }

  protected remove() {
    this.cardRemoved.next();
  }

  protected update(spool: Spool) {
    this.cardUpdated.next(spool);
  }

}
