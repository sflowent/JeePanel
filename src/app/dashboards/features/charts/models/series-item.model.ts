import { Command } from "@dashboards/models/command.model";

export class SeriesItem {
  command: Command | null = null;

  color?: string;
  showFilter = false;
  name: string = '';

  constructor(init?: Partial<SeriesItem>) {
    Object.assign(this, init);
  }
}
