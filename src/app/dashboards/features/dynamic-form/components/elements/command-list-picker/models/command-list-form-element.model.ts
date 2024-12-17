import { FormElementConfig } from "@dashboards/features/dynamic-form/models/dynamic-form.model";
import { CommandListItem } from "@dashboards/models/command-list-item.model";

export class CommandListFormElement extends FormElementConfig<CommandListItem[]> {
    override ui: { hideColors?: boolean; hideBackgroundIcon?: boolean; hideIcon?: boolean } = {  };
  }