import {Spool} from "../model/spool";

export class MessageConverter {

  private encoder = new TextEncoder();
  private decoder = new TextDecoder();

  private readonly NAME_ID = "nm";
  private readonly BRAND_ID = "br";
  private readonly MATERIAL_ID = "ma";
  private readonly COLOR_ID = "cl";
  private readonly SPOOL_WEIGHT_ID = "sw";
  private readonly INITIAL_FILAMENT_WEIGHT_ID = "if";
  private readonly REMAINING_FILAMENT_ID = "rf";
  private readonly FLOW_FACTOR_ID = "ff";
  private readonly TEMPERATURE_ID = "te";
  private readonly SIGNATURE_ID = "sg";

  public messageToSpool(id: string, message: NDEFMessage): Spool {
    const signature = this.getAsString(message, this.SIGNATURE_ID);
    const name = this.getAsString(message, this.NAME_ID);
    const brand = this.getAsString(message, this.BRAND_ID);
    const material = this.getAsString(message, this.MATERIAL_ID);
    const color = this.getAsString(message, this.COLOR_ID);
    const initialFilamentWeight = this.getAsNumber(message, this.INITIAL_FILAMENT_WEIGHT_ID);
    const spoolWeight = this.getAsNumber(message, this.SPOOL_WEIGHT_ID);
    const remainingFilamentWeight = this.getAsNumber(message, this.REMAINING_FILAMENT_ID);
    const flowFactor = this.getAsNumber(message, this.FLOW_FACTOR_ID);
    const temperature = this.getAsNumber(message, this.TEMPERATURE_ID);

    return {
      id,
      signature,
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

    if (spool.signature) {
      records.push(this.getRecord(this.SIGNATURE_ID, spool.signature));
    }
    if (spool.name) {
      records.push(this.getRecord(this.NAME_ID, spool.name));
    }
    if (spool.brand) {
      records.push(this.getRecord(this.BRAND_ID, spool.brand));
    }
    if (spool.material) {
      records.push(this.getRecord(this.MATERIAL_ID, spool.material));
    }
    if (spool.color) {
      records.push(this.getRecord(this.COLOR_ID, spool.color));
    }
    if (spool.initialFilamentWeight) {
      records.push(this.getRecord(this.INITIAL_FILAMENT_WEIGHT_ID, spool.initialFilamentWeight.toString()));
    }
    if (spool.spoolWeight) {
      records.push(this.getRecord(this.SPOOL_WEIGHT_ID, spool.spoolWeight.toString()));
    }
    if (spool.remainingFilamentWeight) {
      records.push(this.getRecord(this.REMAINING_FILAMENT_ID, spool.remainingFilamentWeight.toString()));
    }
    if (spool.flowFactor) {
      records.push(this.getRecord(this.FLOW_FACTOR_ID, spool.flowFactor.toString()));
    }
    if (spool.temperature) {
      records.push(this.getRecord(this.TEMPERATURE_ID, spool.temperature.toString()));
    }

    return this.getMessage(records);
  }

  private getAsString(message: NDEFMessage, key: string): string | undefined {
    let value = message.records.filter(r => r.id === key);
    if (value.length) {
      return this.decoder.decode(value[0].data);
    } else {
      return undefined;
    }
  }

  private getAsNumber(message: NDEFMessage, key: string): number | undefined {
    let value = message.records.filter(r => r.id === key);
    if (value.length) {
      return Number.parseFloat(this.decoder.decode(value[0].data));
    } else {
      return undefined;
    }
  }

  private getRecord(key: string, value: string): NDEFRecord {
    return {recordType: "text", id: key, lang: undefined, data: new DataView(this.encoder.encode(value).buffer)};
  }

  private getMessage(records: NDEFRecord[]): NDEFMessage {
    return {records: records};
  }

}
