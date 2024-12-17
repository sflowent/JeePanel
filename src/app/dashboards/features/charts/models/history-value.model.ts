
export class HistoryValue{
    value: any;
    displayValue: string;
    date: Date;
    color?: string;
    name: string;

    numberValue() : number{
        let returnValue = parseFloat(this.displayValue);
        if (isNaN(returnValue)){
            returnValue = this.value;
        }

        return returnValue;
    }

}