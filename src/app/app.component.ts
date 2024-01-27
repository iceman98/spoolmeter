import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {FormsModule} from "@angular/forms";
import {NfcService} from "./services/nfc.service";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.sass'
})
export class AppComponent {
  title = 'spoolmeter';

  public logs = "";

  constructor(private nfcService: NfcService) {
  }

  public scan() {
    this.nfcService.readTag(10000, this.logs).subscribe();
  }

}
