import { DatePipe } from '@angular/common';
import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { ProvidersService } from '@app/core/providers/services/providers.service';
import { Scenario } from '@app/providers/jeedom/models/scenario';
import { JeedomProviderService } from '@app/providers/jeedom/services/jeedom-provider.service';

@Component({
  selector: 'jee-jeedom-scenarios',
  standalone: true,
  imports: [MatExpansionModule, MatFormFieldModule, MatInput, MatIconModule, MatButtonModule, DatePipe, ReactiveFormsModule],
  templateUrl: './jeedom-scenarios.component.html',
  styleUrl: './jeedom-scenarios.component.scss',
})
export class JeedomScenariosComponent implements OnInit {
  providerCode = input.required<string>();

  formBuilder = inject(FormBuilder);
  providersService = inject(ProvidersService);

  scenarios = signal<Scenario[]>([]);
  jeedomResource = computed(() => {
    return (this.providersService.getProvider(this.providerCode()) as JeedomProviderService).jeedomResource;
  });

  scenariosForms: { loading: boolean; form?: FormGroup; scenario:Scenario }[] = [];

  ngOnInit(): void {
    this.jeedomResource()
      .getScenarios()
      .subscribe((scenarios) => {
        this.scenarios.set(scenarios);

        scenarios.forEach((scenario) => {
          this.scenariosForms.push({
            loading: true,
            scenario: scenario,
            form: undefined
          });
        })
      });
  }

  openScenario(scenarioF: any) {
    if (!scenarioF.form) {
      const scenario = scenarioF.scenario;
      this.jeedomResource()
        .getScenario(scenario.id)
        .subscribe((detailedScenario: Scenario) => {
          this.scenarioFormElements(scenarioF, detailedScenario);
          scenarioF.loading = false;
        });
    }
  }

  addScenario() {

    const scenario = {
      id: "0",
      group: "JeePanel",
      elements: [],
      isActive: "true",
      isVisible: "false",
      mode: "schedule",
      name: "",
      schedule: ""
    };

    const scenariosForm = {
      loading: true,
      scenario: scenario,
      form: undefined
    };

    this.scenariosForms.push(scenariosForm);
    this.scenarioFormElements(scenariosForm, scenario);
  }

  deleteCommand(expressionForm: FormArray, index: number){
    expressionForm.removeAt(index);

  }

  public scenarioFormElements(scenarioF:any, scenarioDetailed: Scenario) {
    const expressions = scenarioDetailed.elements.flatMap((e) => e.subElements).flatMap((e) => e.expressions);

    const expressionsForm = this.formBuilder.array([]) as FormArray;

    scenarioF.form = this.formBuilder.group({
      name: [scenarioDetailed.name, Validators.required],
      schedule: [scenarioDetailed.schedule, Validators.required],
      expressions: expressionsForm
    });

    expressions.forEach((element) => {
      const formCommands = this.formBuilder.group({
        command: [element.expression, Validators.required],
        value: [''],
      });

      expressionsForm.push(formCommands);
    });
  }
}
