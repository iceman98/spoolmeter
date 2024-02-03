import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {FormsModule} from "@angular/forms";
import {NfcService} from "./services/nfc.service";
import {NgIf} from "@angular/common";
import {DebugNfcComponent} from "./components/debug-nfc/debug-nfc.component";
import {environment} from '../environments/environment';
import {TagCardComponent} from "./components/tag-card/tag-card.component";
import {Spool} from "./model/spool";
import {MatInputModule} from "@angular/material/input";
import {MatFormFieldModule} from "@angular/material/form-field";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, DebugNfcComponent, NgIf, TagCardComponent, MatInputModule, MatFormFieldModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.sass'
})
export class AppComponent {
  title = "spoolmeter";
  status: string = "idle";
  spools: Spool[] = [];

  protected environment = environment;

  constructor(private nfcService: NfcService) {
  }

  public scan() {
    this.status = "scanning";
    this.nfcService.readSpool(5000).subscribe({
      next: spool => {
        this.status = "Read spool: " + spool.id;
        console.log(this.status);
        if (!this.spoolScanned(spool)) {
          this.spools.push(spool);
        }
      },
      error: err => {
        this.status = "Could not read spool: " + err;
        console.log(this.status);
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
    this.nfcService.updateSpool(spool);
  }

}
