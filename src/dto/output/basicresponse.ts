import { Status } from "../enums/statusenum";

export class BasicResponse {

    private status: number;
    private data: object;
    private recordCount: number;

    constructor(status: number, data ?: object, recordCount ?: number){
        this.status = status;
        this.data = data;
        this.recordCount = recordCount;
    }
    
    public getData(){
        return this.data;
    }

    public getStatusString() {
        return Status[this.status];
    }

    public getRecordCount() {
        return this.recordCount;
    }
    
}