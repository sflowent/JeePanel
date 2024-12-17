import { CommandValue } from "@dashboards/models/command-value.model";
import { Command, CommandValueType, CommandValueSubType } from "@dashboards/models/command.model";

export class JeedomObject_http {
  id: string;
  name: string;
  father_id?: string;
  isVisible: string;
  position?: string;
  image: any[];
  img: string;
  eqLogics: JeedomEquipement_http[] = [];

  constructor(init?: Partial<JeedomObject_http>) {
    Object.assign(this, init);

    this.eqLogics = [];
    if (init?.eqLogics) {
      init.eqLogics.forEach(eqLogic => {
        const equipement = new JeedomEquipement_http(eqLogic);
        equipement.object = this;
        this.eqLogics.push(equipement);
      });
    }
  }
}

export class JeedomEquipement_http {
  id: string;
  name: string;
  logicalId: string;
  generic_type: any;
  object_id: string;
  eqType_name: string;
  isVisible: string;
  isEnable: string;
  timeout: any;
  category: any;
  order: string;
  comment?: string;
  tags?: string;
  status: any;
  cache: any;
  cmds: JeedomCmd_http[] = [];
  object: JeedomObject_http;

  constructor(init?: Partial<JeedomEquipement_http>) {
    Object.assign(this, init);

    this.cmds = [];
    if (init?.cmds) {
      init.cmds.forEach(cmd => {
        const command = new JeedomCmd_http(cmd);
        command.equipment = this;
        this.cmds.push(command);
      });
    }
  }
}

export class JeedomCmd_http {
  id: string;
  logicalId?: string;
  generic_type?: string;
  eqType: string;
  name: string = '';
  order: string;
  type: string;
  subType: string;
  eqLogic_id: string;
  isHistorized: string;
  unite: string;
  configuration: JeedomCmdConfig_http;
  display: any;
  value?: string;
  isVisible: string;
  alert: any;
  state: any;

  labelId: string;

  equipment: JeedomEquipement_http = new JeedomEquipement_http();

  constructor(init?: Partial<JeedomCmd_http>) {
    Object.assign(this, init);
  }

  toCommandValue(providerCode?: string): CommandValue {
    const command = new CommandValue({
      //providerCode: JeedomService.PROVIDER_NAME,
      providerCode: providerCode,
      commandRef: this.id,
      unit: this.unite,
      value: this.state,
    });
    return command;
  }

  toCommand(providerCode?: string): Command {
    const command = new Command({
      providerCode: providerCode,
      commandRef: this.id,
      unit: this.unite,
      type: this.type as CommandValueType,
      subType: this.subType as CommandValueSubType,
      isHistorized: this?.isHistorized === '1'
    });

    return command;
  }
}

export interface JeedomCmdConfig_http {
  minValue: number;
  maxValue: number;
}
