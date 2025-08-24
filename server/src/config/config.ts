import dotenv from 'dotenv';
 dotenv.config();
 
 interface IApp{
    PORT : string
    ENVIRONMENT : string
}

interface ICors {
    CLIENT_URL : string;
    ALLOWED_HEADERS : string[];
    ALLOWED_METHODS : string[];
    CREDENTIALS : boolean;
}

interface IMongodb{
    URI: string | undefined
}

interface IConfig {
    app: IApp
    mongodb: IMongodb 
    cors: ICors
}


export const config:IConfig = {
    app: {
        PORT: process.env.PORT || "5000",
        ENVIRONMENT : process.env.ENVIRONMENT || 'development'
    },
    mongodb:{
        URI: process.env.MONGODB_URL
    },
    cors: {
        CLIENT_URL: process.env.FRONT_END_URL || 'http://localhost:5173',
        ALLOWED_HEADERS : ['Content-Type', 'Authorization'],
        ALLOWED_METHODS : ["GET", "POST", "DELETE", "PUT","PATCH"],
        CREDENTIALS : true
    },
}