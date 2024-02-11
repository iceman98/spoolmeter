import {Component, Inject, ViewChild} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent, MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {MatStep, MatStepper} from "@angular/material/stepper";
import {MatRadioButton, MatRadioGroup} from "@angular/material/radio";
import {FormsModule} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MatFormField, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {StepperSelectionEvent} from "@angular/cdk/stepper";
import {BRANDS, MATERIALS, WEIGHTS} from "../../model/data";
import {MatAutocomplete, MatAutocompleteTrigger} from "@angular/material/autocomplete";
import {MatOption} from "@angular/material/select";
import {NgxColorsModule} from "ngx-colors";
import {Spool} from "../../model/spool";
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: 'app-spool-wizard',
  standalone: true,
  imports: [
    MatDialogClose,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
    MatStepper,
    MatStep,
    MatRadioGroup,
    MatRadioButton,
    FormsModule,
    MatButton,
    MatFormField,
    MatInput,
    MatAutocomplete,
    MatAutocompleteTrigger,
    MatLabel,
    MatOption,
    MatSuffix,
    NgxColorsModule,
    MatIcon
  ],
  templateUrl: './spool-wizard.component.html',
  styleUrl: './spool-wizard.component.sass'
})
export class SpoolWizardComponent {

  protected readonly brands = BRANDS;
  protected readonly materials = MATERIALS;

  private spool?: Spool;

  constructor(@Inject(MAT_DIALOG_DATA) private data: {
    spool: Spool
  }, private matDialogRef: MatDialogRef<SpoolWizardComponent>) {
    this.spool = data.spool;
  }

  // Step 0
  protected option = "new";

  // Step 1
  protected brand?: string;
  protected material?: string;

  // Step 2
  protected _totalWeight?: number;
  protected set totalWeight(value: number | undefined) {
    this._totalWeight = value;
    this.updateValues();
  }

  protected get totalWeight(): number | undefined {
    return this._totalWeight;
  }

  protected totalWeightEnabled = false;

  //
  private _spentFilamentWeight?: number;

  protected get spentFilamentWeight(): number | undefined {
    return this._spentFilamentWeight;
  }

  protected set spentFilamentWeight(value: number | undefined) {
    this._spentFilamentWeight = value;
    this.updateValues();
  }

  protected spentFilamentWeightEnabled = false;

  //
  private _remainingFilamentWeight?: number;

  protected get remainingFilamentWeight(): number | undefined {
    return this._remainingFilamentWeight;
  }

  protected set remainingFilamentWeight(value: number | undefined) {
    this._remainingFilamentWeight = value;
    this.updateValues();
  }

  protected remainingFilamentWeightEnabled = false;

  //
  private _spoolWeight?: number;

  protected get spoolWeight(): number | undefined {
    return this._spoolWeight;
  }

  protected set spoolWeight(value: number | undefined) {
    this._spoolWeight = value;
    this.updateValues();
  }

  protected spoolWeightEnabled = false;

  // Step 3

  protected name?: string;
  protected color?: string;
  protected flowFactor?: number;
  protected temperature?: number;

  protected confirm() {
    if (this.spool) {
      this.spool.signature = "ic_v1";
      this.spool.name = this.name;
      this.spool.color = this.color;
      this.spool.brand = this.brand;
      this.spool.material = this.material;
      this.spool.spoolWeight = this.spoolWeight;
      this.spool.initialFilamentWeight = this.spentFilamentWeight;
      this.spool.remainingFilamentWeight = this.remainingFilamentWeight;
      this.spool.flowFactor = this.flowFactor;
      this.spool.temperature = this.temperature;
    }
    this.matDialogRef.close("confirm");
  }

  protected change($event: StepperSelectionEvent) {
    if ($event.previouslySelectedIndex === 0) {
      // update step 2 values and locks
      switch (this.option) {
        case "new":
          this.totalWeightEnabled = true;
          this.spentFilamentWeightEnabled = false;
          this.remainingFilamentWeightEnabled = true;
          this.spoolWeightEnabled = false;
          break;
        case "used":
          this.totalWeightEnabled = true;
          this.spentFilamentWeightEnabled = false;
          this.remainingFilamentWeightEnabled = false;
          this.spoolWeightEnabled = true;
          break;
        case "manual":
          this.totalWeightEnabled = true;
          this.spentFilamentWeightEnabled = true;
          this.remainingFilamentWeightEnabled = true;
          this.spoolWeightEnabled = true;
          break;
      }
      this.totalWeight = undefined;
      this.spentFilamentWeight = undefined;
      this.remainingFilamentWeight = undefined;
      this.spoolWeight = undefined;
    } else if ($event.previouslySelectedIndex === 1 && $event.selectedIndex === 2) {
      // get suggested spool weight
      if (this.brand && this.material) {
        // @ts-ignore
        this._spoolWeight = WEIGHTS[`${this.brand},${this.material}`] as (number | undefined);
        this.spoolWeightEnabled = false;
      }
    }
  }

  protected updateValues() {
    const totalWeight = this.totalWeight ? this.totalWeight : 0;
    const spentFilamentWeight = this.spentFilamentWeight ? this.spentFilamentWeight : 0;
    const remainingFilamentWeight = this.remainingFilamentWeight ? this.remainingFilamentWeight : 0;
    const spoolWeight = this.spoolWeight ? this.spoolWeight : 0;

    if (!this.totalWeightEnabled) {
      this._totalWeight = spentFilamentWeight + remainingFilamentWeight + spoolWeight;
    }
    if (!this.spoolWeightEnabled) {
      this._spoolWeight = totalWeight - remainingFilamentWeight - spentFilamentWeight;
    }
    if (!this.spentFilamentWeightEnabled) {
      this._spentFilamentWeight = 0;
    }
    if (!this.remainingFilamentWeightEnabled) {
      this._remainingFilamentWeight = totalWeight - spoolWeight - spentFilamentWeight;
    }
  }

}
