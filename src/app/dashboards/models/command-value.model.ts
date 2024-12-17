export class CommandValue{

  commandRef: string = '';
  providerCode: string = '';

  unit?: string | null;
  value?: any;

  constructor(init?: Partial<CommandValue>) {
    Object.assign(this, init);
  }
} 
