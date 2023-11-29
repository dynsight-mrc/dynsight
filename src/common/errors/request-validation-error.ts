export class RequestValidationError extends Error{
    statusCode = 400

    constructor(message:string,status:number){
        super(message)
        this.statusCode=status
    }

}