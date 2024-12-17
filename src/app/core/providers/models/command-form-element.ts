import { FormElementConfig } from "@dashboards/features/dynamic-form/models/dynamic-form.model";
import { Command } from "@dashboards/models/command.model";

export class CommandFormElementConfig extends FormElementConfig<Command> {
  override ui?: { type: string; subType: string; presets: [], isHistorized: boolean };

  constructor(init?: Partial<CommandFormElementConfig>){
    super();

    Object.assign(this, init);
    this.value = init?.value ?? null;
  }
}
