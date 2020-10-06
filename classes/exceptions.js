module.exports.SongIsNotAvailable = class SongIsNotAvailable extends Error{
    constructor(message){
        super();
        this.name = "SongIsNotAvailable";
        this.message = message;
    }
}

module.exports.UnexpectedAPIResponse = class UnexpectedResponse extends Error{
    constructor(message){
        super();
        this.name = "UnexpectedAPIResponse";
        this.message = message;
    }
}

module.exports.BadRequest = class BadRequest extends Error{
    constructor(message){
        super();
        this.name = "BadRequest";
        this.message = message;
    }
}

module.exports.NoVideoFound = class NoVideoFound extends Error{
    constructor(message){
        super();
        this.name = "NoVideoFound";
        this.message = message;
    }
}

module.exports.EmptyPlaylist = class EmptyPlaylist extends Error{
    constructor(message){
        super();
        this.name = "EmptyPlaylist";
        this.message = message;
    }
}