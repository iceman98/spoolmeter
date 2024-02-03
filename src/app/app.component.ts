import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {FormsModule} from "@angular/forms";
import {NfcService} from "./services/nfc.service";
import {NgIf} from "@angular/common";
import {DebugNfcComponent} from "./components/debug-nfc/debug-nfc.component";
import {environment} from '../environments/environment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, DebugNfcComponent, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.sass'
})
export class AppComponent {
  title = "spoolmeter";
  status: string = "idle";

  constructor(private nfcService: NfcService) {
  }

  public scan() {
    this.status = "scanning";
    this.nfcService.readSpool(5000).subscribe({
      next: spool => {
        this.status = "Read spool: " + spool.id;
        console.log(this.status);
      },
      error: err => {
        this.status = "Could not read spool: " + err;
        console.log(this.status);
      }
    });
  }

  protected environment = environment;

}
