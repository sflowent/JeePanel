import { HistoryValue } from "@dashboards/features/charts/models/history-value.model";

export class jeedomGetHistoryResult_rpc{
    result: jeedomHistoryValue_rpc[];
}

export class jeedomHistoryValue_rpc{

    cmd_id: string
    value: string
    datetime: Date

    constructor(init?: Partial<jeedomHistoryValue_rpc>){
        Object.assign(this, init);

        this.datetime = new Date(init.datetime);
    }

    toHistoryValue(): any {
        const value = new HistoryValue();
        value.date = this.datetime;
        value.value = this.value;
        //value.displayValue = this.value;

        return value;
      }
}