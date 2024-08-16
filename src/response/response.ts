export class responseTemp {
    status: 'success'|'error'; message: string; data: any;

    constructor( status: 'success'|'error', message: string, data: any ) {
        this.status = status;
        this.message = message;
        this.data = data;
    }
}