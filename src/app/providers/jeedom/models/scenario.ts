import { clone } from "@app/shared/functions/clone";

export interface Scenario {
  nextRun?: string;
  id: string;
  name: string;
  isActive: string;
  group: string;
  mode: string;
  schedule: string;
  isVisible: string;
  elements: ScenarioElement[];
  scheduleReadable?: string;
}

export interface ScenarioElement {
  name: any;
  type: string;
  options: any[];
  order: string;
  subElements: ScenarioSubElement[];
}

export interface ScenarioSubElement {
  name: any;
  type: string;
  subtype: string;
  options: ScenarioSubElementOptions;
  order: string;
  expressions: ScenarioElementExpression[];
}

export interface ScenarioSubElementOptions {
  collapse: string;
  enable: string;
}

export interface ScenarioElementExpression {
  id: string;
  type: string;
  subtype: any;
  expression: string;
  options: ScenarioElementExpressionOptions;
  order: string;
}

export interface ScenarioElementExpressionOptions {
  enable: string;
  background: string;
}

const scenario_template = {
    name: 'Jeepanel - Text 1',
    isActive: '1',
    group: 'JeePanel',
    mode: 'schedule',
    schedule: '00 12 02 01 * 2025',
    isVisible: '0',
    elements: [
      {
        type: 'action',
        subElements: [
          {
            type: 'action',
            subtype: 'action',
            expressions: [
              {
                type: 'action',
                expression: '#[Aucun][(zigbee)prise][identify identify]#',
              },
              {
                type: 'action',
                expression: '#[Aucun][(zigbee)prise][identify identify]#',
              },
            ],
          },
        ],
      },
    ]
};

export function GetScenarioTemplate(): Scenario {
    return clone(scenario_template);
}
