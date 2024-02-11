import {Component, EventEmitter, Inject, Input, Output} from '@angular/core';
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
import {MAT_DIALOG_DATA, MatDialogClose} from "@angular/material/dialog";

@Component({
  selector: 'app-spool-modal',
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
    MatDialogClose
  ],
  templateUrl: './spool-modal.html',
  styleUrl: './spool-modal.sass'
})
export class SpoolModal {

  constructor(@Inject(MAT_DIALOG_DATA) private data: { spool: Spool }) {
    this.spool = data.spool;
  }

  protected spool: Spool;

  brands = [
    "JAYO",
    "eSUN",
    "Amazon Basics"
  ];

  materials = [
    "PLA",
    "PLA+",
    "HS-PLA"
  ];

  protected update() {
    console.log(this.spool);
  }

}
