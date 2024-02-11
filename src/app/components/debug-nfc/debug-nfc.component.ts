import {Component} from '@angular/core';
import {NfcEmulatorService} from "../../services/nfc-emulator.service";
import {AsyncPipe} from "@angular/common";
import {MatCard, MatCardActions, MatCardContent, MatCardHeader} from "@angular/material/card";
import {MatButton} from "@angular/material/button";
import {MatGridList, MatGridTile} from "@angular/material/grid-list";
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: 'app-debug-nfc',
  standalone: true,
  imports: [
    AsyncPipe,
    MatCard,
    MatCardHeader,
    MatCardContent,
    MatCardActions,
    MatButton,
    MatGridList,
    MatGridTile,
    MatIcon
  ],
  templateUrl: './debug-nfc.component.html',
  styleUrl: './debug-nfc.component.sass'
})
export class DebugNfcComponent {

  constructor(protected nfcEmulator: NfcEmulatorService) {
    nfcEmulator.spools$();
  }

  protected touch(id: string) {
    this.nfcEmulator.touchTag(id);
  }

  protected error() {
    this.nfcEmulator.readError("Invalid tag");
  }

  protected delete(id: string) {
    this.nfcEmulator.remove(id);
  }

  protected create() {
    this.nfcEmulator.addSpool({id: crypto.randomUUID()});
  }

}
