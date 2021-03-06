import express from 'express';
import { SERVER_PORT } from '../global/environment';
import  socketIO  from 'socket.io';
import  http  from 'http';
import * as socket from '../sockets/sockets';

export default class Server {

    private static _instance: Server;
   
    public app:  express.Application;
    public port: number;

    public io: socketIO.Server;
    private httpServer: http.Server;

   private constructor() {
        
        this.app = express();
        this.port = SERVER_PORT;

        this.httpServer = new http.Server( this.app );
        this.io = socketIO( this.httpServer );

        this.listenerSocket()
    }

    public static get instance() {
        return this._instance || ( this._instance = new this() );
    }

    private listenerSocket() {
        console.log(`Escuchando conexiones - sockets`);

        this.io.on('connection', client => {

            // conectar cliente

            socket.connectClient( client, this.io )

             // config user
             socket.configUser( client, this.io ); 
             
             // optener usuarios activos
             socket.getUsers( client, this.io ); 
           
            // Message
            socket.message( client, this.io );

            // Desconectar
            socket.disconnect( client, this.io ); 
            
        })
        
    }

    start(callback: Function) {
        this.httpServer.listen( this.port, callback);
    }
}