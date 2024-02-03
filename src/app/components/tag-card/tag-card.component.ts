import {Component, EventEmitter, Input, Output} from '@angular/core';
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

@Component({
  selector: 'app-tag-card',
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
    NgxColorsModule
  ],
  templateUrl: './tag-card.component.html',
  styleUrl: './tag-card.component.sass'
})
export class TagCardComponent {

  @Input()
  spool: Spool | undefined;

  @Output()
  cardRemoved = new EventEmitter<void>();

  @Output()
  saveTag = new EventEmitter<void>();

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

  protected remove() {
    this.cardRemoved.next();
  }

  protected update() {
    this.saveTag.next()
  }

}
