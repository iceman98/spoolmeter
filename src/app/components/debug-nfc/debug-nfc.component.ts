import {Component} from '@angular/core';
import {NfcEmulatorService} from "../../services/nfc-emulator.service";
import {AsyncPipe} from "@angular/common";
import {MatCard, MatCardActions, MatCardContent, MatCardHeader} from "@angular/material/card";
import {MatButton} from "@angular/material/button";
import {Spool} from "../../model/spool";

@Component({
  selector: 'app-debug-nfc',
  standalone: true,
  imports: [
    AsyncPipe,
    MatCard,
    MatCardHeader,
    MatCardContent,
    MatCardActions,
    MatButton
  ],
  templateUrl: './debug-nfc.component.html',
  styleUrl: './debug-nfc.component.sass'
})
export class DebugNfcComponent {

  constructor(private nfcEmulator: NfcEmulatorService) {
    this.tags = nfcEmulator.getSpools();
  }

  protected tags: Spool[];

  protected touch(id: string) {
    this.nfcEmulator.touchTag(id);
  }

  // protected createTag(): void {
  //   const tags = (this.tags as BehaviorSubject<Spool[]>).getValue();
  //
  //   this.nfcEmulator.createSpool({
  //     id: (parseInt(tags[tags.length - 1].id) + 1).toString(),
  //   });
  // }

  // protected deleteSpool(tag: Spool) {
  //   this.nfcEmulator.deleteSpool(tag);
  // }

}
