import {Component, Inject} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle
} from "@angular/material/dialog";
import {Spool} from "../../model/spool";
import {MatButton} from "@angular/material/button";
import {FormsModule} from "@angular/forms";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatRadioButton, MatRadioGroup} from "@angular/material/radio";
import {MatStep, MatStepper} from "@angular/material/stepper";
import {StepperSelectionEvent} from "@angular/cdk/stepper";

@Component({
  selector: 'app-weight-in-dialog',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButton,
    FormsModule,
    MatFormField,
    MatInput,
    MatLabel,
    MatRadioButton,
    MatRadioGroup,
    MatStep,
    MatStepper
  ],
  templateUrl: './weigh-in-dialog.component.html',
  styleUrl: './weigh-in-dialog.component.sass'
})
export class WeighInDialogComponent {

  protected spool: Spool;

  protected option = "total";

  private _totalWeight: number | undefined;
  protected totalWeightEnabled = true;
  private _additionalWeight: number | undefined;
  protected additionalWeightEnabled = true;
  private _remainingWeight: number | undefined;
  protected remainingWeightEnabled = false;

  get totalWeight(): number | undefined {
    return this._totalWeight;
  }

  set totalWeight(value: number | undefined) {
    this._totalWeight = value;
    this.updateValues();
  }

  get additionalWeight(): number | undefined {
    return this._additionalWeight;
  }

  set additionalWeight(value: number | undefined) {
    this._additionalWeight = value;
    this.updateValues();
  }

  get remainingWeight(): number | undefined {
    return this._remainingWeight;
  }

  set remainingWeight(value: number | undefined) {
    this._remainingWeight = value;
    this.updateValues();
  }

  constructor(@Inject(MAT_DIALOG_DATA) private data: { spool: Spool }) {
    this.spool = data.spool;
    this._remainingWeight = data.spool.remainingFilamentWeight;
  }

  private updateValues() {
    const spool = this.spool.spoolWeight ? this.spool.spoolWeight : 0;

    if (this.option == "total") {
      const total = this._totalWeight ? this._totalWeight : 0;
      const additional = this._additionalWeight ? this._additionalWeight : 0;
      this._remainingWeight = total - spool - additional;
    } else {
      const remaining = this._remainingWeight ? this._remainingWeight : 0;
      this._totalWeight = spool + remaining;
    }

    const original = this.spool.remainingFilamentWeight ? this.spool.remainingFilamentWeight : 0;
    const remaining = this._remainingWeight ? this._remainingWeight : 0;
    this.spentWeight = original - remaining;
  }

  protected spentWeight: number | undefined;

  protected change($event: StepperSelectionEvent) {
    if ($event.previouslySelectedIndex === 0 && $event.selectedIndex === 1) {
      this._totalWeight = undefined;
      this._additionalWeight = undefined;
      this._remainingWeight = undefined;

      if (this.option === "total") {
        this.totalWeightEnabled = true;
        this.additionalWeightEnabled = true;
        this.remainingWeightEnabled = false;
      } else {
        this.totalWeightEnabled = false;
        this.additionalWeightEnabled = false;
        this.remainingWeightEnabled = true;
      }
    }
  }

}
