import errorHandler from "errorhandler";
import express from "express";

import SocketIO, { Socket } from "socket.io";
import { Server } from "http";

import { SocketClientWorker } from "./controllers/sokectio-proxy";

/* --оставллено на будущее lusca про безопасность, compression про сжатие, path про пути, bluebird про удобные промисы,body-parser про обработку тела запроса в разных форматах.

import lusca from "lusca";
import path from "path";
import compression from "compression";
import bluebird from "bluebird";
import bodyParser from "body-parser";
-- про разные переменные окружения и секреты
//import { MONGODB_URI, SESSION_SECRET } from "./util/secrets";
*/


// Create Express server
export const app = express();

// Express configuration
app.set("port", process.env.PORT || 3003);
/**
 * Error Handler. Provides full stack - remove for production
 */
app.use(errorHandler());

export const startAppServer = (): {socketIoServer: SocketIO.Server, server: Server} => {
  /**
   * Start Express server.
   */
  app.get(/cookie/, (req, response) => {
    console.log("sdkjdksfjh");
    response.setHeader('Set-Cookie', 'foo=bar; HttpOnly');
  });
  let server = app.listen(app.get("port"), () => {
    console.log(
      "  App is running at http://localhost:%d in %s mode",
      app.get("port"),
      app.get("env")
    );
    console.log("  Press CTRL-C to stop\n");
  });


  let socketIoServer = SocketIO(server);
  //middleware example
  //socketIoServer.use(function(socket, next){});
  socketIoServer.on("connection", (socket: Socket) => {

    let clientConnection = new SocketClientWorker(socket);
    socket.on('close', () => {
      clientConnection.close();
      clientConnection = undefined;
    })

  });

  server.on("error", (err) => {
    console.log("Server got error", err);
  });


  return {socketIoServer: socketIoServer, server: server};
}