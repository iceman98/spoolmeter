import {Component, Inject} from '@angular/core';
import {MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardTitle} from "@angular/material/card";
import {MatButton} from "@angular/material/button";
import {Spool} from "../../model/spool";
import {MatFormField, MatFormFieldModule, MatLabel} from "@angular/material/form-field";
import {MatOption, MatSelect} from "@angular/material/select";
import {MatSelectionList} from "@angular/material/list";
import {MatAutocomplete, MatAutocompleteTrigger} from "@angular/material/autocomplete";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatInput, MatInputModule} from "@angular/material/input";
import {NgxColorsModule} from "ngx-colors";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle
} from "@angular/material/dialog";
import {BRANDS, MATERIALS} from "../../model/data";

@Component({
  selector: 'app-edit-dialog',
  standalone: true,
  imports: [
    MatCard,
    MatCardHeader,
    MatCardContent,
    MatCardActions,
    MatButton,
    MatCardTitle,
    MatFormField,
    MatSelect,
    MatSelectionList,
    MatAutocomplete,
    FormsModule,
    MatInput,
    MatAutocompleteTrigger,
    MatOption,
    MatLabel,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    NgxColorsModule,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions
  ],
  templateUrl: './edit-dialog.component.html',
  styleUrl: './edit-dialog.sass'
})
export class EditDialog {

  constructor(@Inject(MAT_DIALOG_DATA) private data: { spool: Spool }) {
    this.spool = data.spool;
  }

  protected spool: Spool;

  brands = BRANDS;

  materials = MATERIALS;

  protected update() {
    console.log(this.spool);
  }

}
