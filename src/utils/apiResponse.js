class apirsponse {
    constructor(statusCode , data , messasge  = "succes"){
        this.statusCode = statusCode
        this.data =data
        this.messasge = messasge
        this.succes = statusCode <  400
    }
}
export {apirsponse}