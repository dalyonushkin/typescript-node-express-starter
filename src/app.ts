import * as apiController from "./controllers/api";

import bluebird from "bluebird";
import bodyParser from "body-parser";
import compression from "compression";
import express from "express";
import lusca from "lusca";
import path from "path";

import { MONGODB_URI, SESSION_SECRET } from "./util/secrets";

// compresses requests








// Controllers (route handlers)




// Create Express server
const app = express();

// Express configuration
app.set("port", process.env.PORT || 3000);
//app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

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
/**
 * Primary app routes.
 */
//app.get("/", homeController.index);

/**
 * API examples routes.
 */
app.get("/api", apiController.getApi);

export default app;
