import { retry } from "rxjs";

export class ProviderSettings {

  /**
   * Provider Id
   */
  id: number;

  /**
   * ProviderType (same as ProviderDefinition)
   */
  type: string;

  /**
   * Unique code of this configuration
   */
  code: string;

  /**
   * Label of Provider
   */
  label: string | undefined;

  constructor(init?: Partial<ProviderSettings>){
    Object.assign(this, init);
  }

  // toJSON(): any {
  //   return {
  //     id: this.id,
  //     type: this.type,
  //     code: this.code
  //   }
  // }
}
