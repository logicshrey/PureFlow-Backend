class apiResponse{

    constructor(statusCode, message="Success", data){
        this.statusCode = statusCode;
        this.message = message,
        this.data = data
    }
}

export { apiResponse }