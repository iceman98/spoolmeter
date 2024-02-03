import {Spool} from "../model/spool";
import {environment} from "../../environments/environment";

export class MessageConverter {

  private encoder = new TextEncoder();
  private decoder = new TextDecoder();

  public messageToSpool(id: string, message: NDEFMessage): Spool {
    const name = this.getAsString(message, "name");
    const brand = this.getAsString(message, "brand");
    const material = this.getAsString(message, "material");
    const color = this.getAsString(message, "color");
    const initialFilamentWeight = this.getAsNumber(message, "filament");
    const spoolWeight = this.getAsNumber(message, "spool");
    const remainingFilamentWeight = this.getAsNumber(message, "remaining");
    const flowFactor = this.getAsNumber(message, "factor");
    const temperature = this.getAsNumber(message, "temperature");

    return {
      id,
      name,
      brand,
      material,
      color,
      initialFilamentWeight,
      spoolWeight,
      remainingFilamentWeight,
      flowFactor,
      temperature
    };
  }

  public spoolToMessage(spool: Spool): NDEFMessage {
    const records: NDEFRecord[] = [];
    if (spool.name) {
      records.push(this.getRecord("name", spool.name));
    }
    if (spool.brand) {
      records.push(this.getRecord("brand", spool.brand));
    }
    if (spool.material) {
      records.push(this.getRecord("material", spool.material));
    }
    if (spool.color) {
      records.push(this.getRecord("color", spool.color));
    }
    if (spool.initialFilamentWeight) {
      records.push(this.getRecord("filament", spool.initialFilamentWeight.toString()));
    }
    if (spool.spoolWeight) {
      records.push(this.getRecord("spool", spool.spoolWeight.toString()));
    }
    if (spool.remainingFilamentWeight) {
      records.push(this.getRecord("remaining", spool.remainingFilamentWeight.toString()));
    }
    if (spool.flowFactor) {
      records.push(this.getRecord("factor", spool.flowFactor.toString()));
    }
    if (spool.temperature) {
      records.push(this.getRecord("temperature", spool.temperature.toString()));
    }
    return this.getMessage(records);
  }

  private getAsString(message: NDEFMessage, key: string): string | undefined {
    let value = message.records.filter(r => r.recordType === key);
    if (value.length) {
      return this.decoder.decode(value[0].data);
    } else {
      return undefined;
    }
  }

  private getAsNumber(message: NDEFMessage, key: string): number | undefined {
    let value = message.records.filter(r => r.recordType === key);
    if (value.length) {
      return Number.parseFloat(this.decoder.decode(value[0].data));
    } else {
      return undefined;
    }
  }

  private getRecord(key: string, value: string): NDEFRecord {
    if (environment.isDev) {
      return {recordType: key, data: new DataView(this.encoder.encode(value).buffer)};
    } else {
      return new NDEFRecord({recordType: key, data: value});
    }
  }

  private getMessage(records: NDEFRecord[]): NDEFMessage {
    if (environment.isDev) {
      return {records: records};
    } else {
      return new NDEFMessage({records: records});
    }
  }

}