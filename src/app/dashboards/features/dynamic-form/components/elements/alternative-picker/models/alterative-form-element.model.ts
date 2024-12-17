import { FormElementConfig } from "@dashboards/features/dynamic-form/models/dynamic-form.model";
import { AlternativeItem } from "@dashboards/models/alternative-settings.model";
import { CommandListItem } from "@dashboards/models/command-list-item.model";

export class AlternativeFormElement extends FormElementConfig<AlternativeItem[]> {
    override ui: { hideColors?: boolean; hideIcons?: boolean } = {  };
  }