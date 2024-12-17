export enum CommandValueType {
  action = 'action',
  info = 'info'
}

export enum CommandValueSubType {
  color = 'color',
  number = 'number',
  string = 'string'
}

export class Command {
  commandRef: string = '';
  providerCode: string = '';

  unit?: string | null;

  type: CommandValueType = CommandValueType.info;
  subType?: CommandValueSubType = CommandValueSubType.string;
  isHistorized: boolean = false;

  toJSON(): any{
    return {
      commandRef: this.commandRef,
      providerCode: this.providerCode,
      isHistorized: this.isHistorized
    }
  }

  constructor(init?: Partial<Command>) {
    Object.assign(this, init);
  }
}
