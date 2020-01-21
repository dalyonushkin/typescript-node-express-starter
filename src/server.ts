import { Server } from "http";

import { startAppServer } from "./app";

//import SocketIO from "socket.io"



/**
 * Error Handler. Provides full stack - remove for production
 */
//app.use(errorHandler());

/**
 * Start Express server.
 */
/*console.log("sdkjgdsfkj");*/
/*const server = app.listen(app.get("port"), () => {
  console.log(
    "  App is running at http://localhost:%d in %s mode",
    app.get("port"),
    app.get("env")
  );
  console.log("  Press CTRL-C to stop\n");
});*/


/*let io = SocketIO(server);

io.on('connection', function(socket) {
  console.log('a user connected');
});*/

//console.log(io);
let servers: {socketIoServer: SocketIO.Server, server: Server} = startAppServer();
export const socketIoServer = servers.socketIoServer;
export const server = servers.server;
