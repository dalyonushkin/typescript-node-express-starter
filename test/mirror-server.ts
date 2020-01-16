import bodyParser from "body-parser";
import errorHandler from "errorhandler";
import express from "express";

import { Request, Response } from "express";

export const mirrorApp = express();

// Express configuration
mirrorApp.set("port", process.env.UNIT_TEST_MIRROR_SERVER_PORT || 4000);

let mirrorApi = (req: Request, res: Response) => {
  switch (req.header("Content-Type")) {
    case "application/json":
      res.type("json").send(req.body);
      break;
    default:
      res.type("text");
      if (req.body && JSON.stringify(req.body) != "{}") {
        res.end(req.body);
      }
      else {
        res.end();
      }
  }
};

mirrorApp.get("/mirror", mirrorApi);
mirrorApp.post("/mirror", bodyParser.text(), bodyParser.json(), bodyParser.urlencoded({extended: true}), mirrorApi);

mirrorApp.use(errorHandler());

export const mirrorServer = mirrorApp.listen(mirrorApp.get("port"), () => {
  console.log(
    " Mirror App is running at http://localhost:%d in %s mode",
    mirrorApp.get("port"),
    mirrorApp.get("env")
  );
  console.log("  Press CTRL-C to stop\n");
});

mirrorServer.on("error", (err) => {
  console.log("Server got error", err);
});