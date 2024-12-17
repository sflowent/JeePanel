import { ProviderSettings } from "@app/core/providers/models/provider-settings.model";

export class JeedomConfig extends ProviderSettings {
  url: string;
  apiKey: string;
  waitTimeBetweenPolls: number = 1000;

  isValid(){
    return this.url && this.apiKey;
  }

  // override toJSON(): any {
  //   const json = super.toJSON();
  //   json.url = this.url;
  //   json.apiKey = this.apiKey;
  //   json.waitTimeBetweenPolls = this.waitTimeBetweenPolls;
  //  return json;
  // }
}
