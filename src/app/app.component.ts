import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {FormsModule} from "@angular/forms";
import {NfcService} from "./services/nfc.service";
import {NgIf} from "@angular/common";
import {DebugNfcComponent} from "./components/debug-nfc/debug-nfc.component";
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, DebugNfcComponent, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.sass'
})
export class AppComponent {
  title = 'spoolmeter';

  constructor(private nfcService: NfcService) {
  }

  public scan() {
    this.nfcService.readSpool(5000).subscribe();
  }

  protected environment = environment;

}
