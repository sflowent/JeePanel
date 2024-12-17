import { ClassProvider, Type } from "@angular/core";

export class ProviderDefinition implements ClassProvider {
    providerType!: string;
    providerName!: string;
  
    provide: any;
    multi?: boolean | undefined;
    useClass!: Type<any>;
  }