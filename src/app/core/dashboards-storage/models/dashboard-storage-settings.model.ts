export class DashboardStorageSettings{
    code: string = "";
    selected: boolean = false;
    data?: any;

    public toJSON(){
        return{
            code: this.code,
            selected: this.selected,
            data: this.data?.toJSON ? this.data?.toJSON() : this.data
        }
    }

    constructor (init?: Partial<DashboardStorageSettings>){
        Object.assign(this, init);
    }
}