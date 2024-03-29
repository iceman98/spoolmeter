import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {FormsModule} from "@angular/forms";
import {NfcService} from "./services/nfc.service";
import {AsyncPipe, NgIf} from "@angular/common";
import {DebugNfcComponent} from "./components/debug-nfc/debug-nfc.component";
import {environment} from '../environments/environment';
import {EditDialog} from "./components/edit-dialog/edit-dialog.component";
import {Spool} from "./model/spool";
import {MatInputModule} from "@angular/material/input";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatGridList, MatGridTile} from "@angular/material/grid-list";
import {MatToolbar} from "@angular/material/toolbar";
import {MatAnchor, MatButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {MatDialog} from "@angular/material/dialog";
import {HelpDialogComponent} from "./components/help-dialog/help-dialog.component";
import {MatCard, MatCardTitle} from "@angular/material/card";
import {SpoolCardComponent} from "./components/spool-card/spool-card.component";
import {WriteDialogComponent} from "./components/write-dialog/write-dialog.component";
import {PermissionDialogComponent} from "./components/permission-dialog/permission-dialog.component";
import {ToastService} from "./services/toast.service";
import {SpoolWizardComponent} from "./components/spool-wizard/spool-wizard.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, DebugNfcComponent, NgIf, EditDialog, MatInputModule, MatFormFieldModule, MatGridList, MatGridTile, MatToolbar, MatButton, MatIcon, MatProgressSpinner, MatCard, MatCardTitle, AsyncPipe, SpoolCardComponent, MatAnchor],
  templateUrl: './app.component.html',
  styleUrl: './app.component.sass'
})
export class AppComponent {

  protected spools: Spool[] = [];

  protected environment = environment;

  constructor(protected nfcService: NfcService, private dialog: MatDialog, private toastService: ToastService) {
    this.nfcService.spool$().subscribe({
      next: spool => {
        this.toastService.showToast("Scanned spool tag " + spool.id, 1000);
        if (!this.spoolScanned(spool)) {
          this.spools.push(spool);
          if (!spool.signature || !spool.signature.startsWith("ic_v")) {
            this.showWizard(spool);
          }
        }
      },
      error: err => {
        this.toastService.showToast("Error scanning tag, try again?", 1000);
        console.log(err);
      }
    });

    this.nfcService.status$().subscribe({
      next: s => {
        if (s === "error") {
          this.showPermissionDialog();
        }
      }
    });
  }

  private spoolScanned(spool: Spool): boolean {
    return this.spools.filter(s => s.id === spool.id).length != 0;
  }

  protected removeSpool(id: string) {
    this.spools = this.spools.filter(s => s.id != id);
  }

  protected updateSpool(spool: Spool) {
    const dialog = this.dialog.open(WriteDialogComponent, {
      data: {spool},
      disableClose: true,
      width: this.environment.isDev ? "600px" : undefined,
      height: this.environment.isDev ? "500px" : undefined
    });

    dialog.afterClosed().subscribe(r => {
      if (r === "cancel") {
        this.nfcService.cancelWrite();
        dialog.close();
      }
    });

    this.nfcService.updateSpool(spool).subscribe({
      next: () => {
        const index = this.spools.findIndex(s => s.id === spool.id);
        this.spools[index] = spool;
        this.toastService.showToast("Spool updated", 1000);
      },
      error: e => {
        console.log(e);
        dialog.close();
        this.toastService.showToast("Could not write tag", 2000);
      },
      complete: () => {
        dialog.close();
      }
    });
  }

  protected showHelp(): void {
    this.dialog.open(HelpDialogComponent);
  }

  protected showPermissionDialog(): void {
    this.dialog.open(PermissionDialogComponent, {disableClose: true});
  }

  protected showWizard(spool: Spool): void {
    const dialog = this.dialog.open(SpoolWizardComponent, {disableClose: true, data: {spool}});
    dialog.afterClosed().subscribe(r => {
      if (r === "confirm") {
        this.updateSpool(spool);
      }
    });
  }

  protected get csvUrl() {
    const header = "id,name,brand,material,color,initialFilament,spool,remainingFilament,flowFactor,temperature";
    const data = this.spools.map(s => `${s.id},${s.name?s.name:''},${s.brand?s.brand:''},${s.material?s.material:''},${s.color?s.color:''},${s.initialFilamentWeight?s.initialFilamentWeight:''},${s.spoolWeight?s.spoolWeight:''},${s.remainingFilamentWeight?s.remainingFilamentWeight:''},${s.flowFactor?s.flowFactor:''},${s.temperature?s.temperature:''}`).join("\n");
    return `data:application/octet-stream;charset=utf-16;base64,${btoa(header + "\n" + data)}`;
  }
}
