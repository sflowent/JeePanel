import { Command } from '@dashboards/models/command.model';
import { JeedomProviderService } from '../../services/jeedom-provider.service';

export class JeedomStorageConfig {
  command: Command | undefined;

  constructor(init?: Partial<JeedomStorageConfig>) {
    if (init?.command) {
      this.command = new Command(init.command!);
    }
  }

  toJSON(): any {
    return {
      command: this.command?.toJSON ? this.command?.toJSON() : this.command,
    };
  }
}
