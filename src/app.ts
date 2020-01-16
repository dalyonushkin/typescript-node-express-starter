import * as apiController from "./controllers/api";

import bluebird from "bluebird";
import bodyParser from "body-parser";
import compression from "compression";
import errorHandler from "errorhandler";
import express from "express";
import lusca from "lusca";
import path from "path";
import request from "request";

import SocketIO from "socket.io";

import { MONGODB_URI, SESSION_SECRET } from "./util/secrets";

// compresses requests



//var io = require('socket.io')(http);


// Controllers (route handlers)




// Create Express server
export const app = express();

// Express configuration
app.set("port", process.env.PORT || 3003);
//app.use(compression());
//app.use(bodyParser.json());
//app.use(bodyParser.raw({type: ["txt", "json"]}));
//app.use(bodyParser.urlencoded({extended: true}));

//app.use(lusca.xframe("SAMEORIGIN"));
//app.use(lusca.xssProtection(true));

/*app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});
app.use((req, res, next) => {
  // After successful login, redirect back to the intended page
  if (!req.user &&
    req.path !== "/login" &&
    req.path !== "/signup" &&
    !req.path.match(/^\/auth/) &&
    !req.path.match(/\./)) {
    req.session.returnTo = req.path;
  } else if (req.user &&
    req.path == "/account") {
    req.session.returnTo = req.path;
  }
  next();
});


*/
/*app.use("/api", function(req, res) {
  res.setHeader('Content-Type', 'text/plain')
  res.write('you posted:\n')
  res.end(JSON.stringify(req.body, null, 2))
});*/


/**
 * Primary app routes.
 */
//app.get("/", homeController.index);

/**
 * API unti test routes.
 */
if (app.get("env") == "test") {
  app.get("/api/mirror", apiController.mirrorApi);
  app.post("/api/mirror", bodyParser.text(), bodyParser.json(), bodyParser.urlencoded({extended: true}), apiController.mirrorApi);
}







/**
 * Error Handler. Provides full stack - remove for production
 */
app.use(errorHandler());

/**
 * Start Express server.
 */

export const server = app.listen(app.get("port"), () => {
  console.log(
    "  App is running at http://localhost:%d in %s mode",
    app.get("port"),
    app.get("env")
  );
  console.log("  Press CTRL-C to stop\n");
  app.emit("appStarted");
});


export const socketIoServer = SocketIO(server);

socketIoServer.on("connection", function(socket) {
  console.log("a user connected");
  socket.on("disconnect", function() {
    console.log("user disconnected");
  });

  socket.on("restGate", (data, fn) => {
    console.log("user call restGate", data);
    const options = {
      "method": "GET",
      "url": "https://ya.ru"

    };

    /*let options = {
      'method': 'POST',
      'url': 'http://[::1]:3003/api/mirror',
      'headers': {
        'Content-Type': 'application/json'
      },
      body: "{\"ss\":\"ksd;ghfds\"}"

    };*/
    console.log(options);
    request(options, function(error, response) {

      if (error) {
        console.log("error1", error);
        fn("data");
        throw new Error(error);
      }

      console.log(response.statusCode);
      fn(response.statusCode);

    });


  });
});

server.on("error", (err) => {
  console.log("Server got error", err);
});