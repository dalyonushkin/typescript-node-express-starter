import bodyParser from "body-parser";
import errorHandler from "errorhandler";
import express from "express";

import { Request, Response } from "express";
import { Server } from "http";

export const mirrorApp = express();

// Express configuration
mirrorApp.set("port", process.env.UNIT_TEST_MIRROR_SERVER_PORT || 4000);

let mirrorApi = (req: Request, res: Response) => {
  let resp = {
    url: req.url,
    body: req.body,
    headers: req.headers,
    method: req.method
  }
  res.type("json").send(resp);
  /*switch (req.header("Content-Type")) {
    case "application/json":
      console.log("json", req.body);
      resp.body = req.body;
      res.type("json").send(resp);
      break;
    default:
      res.type("json");
      resp.body = req.body;
      if (req.body && JSON.stringify(req.body) != "{}") {
        resp.body = req.body;
        //res.end(resp);
      }
      console.log("text", resp);
      console.log("text", req.method);
      res.send(resp);
    //res.end();
  }*/
};

mirrorApp.get(/mirror/, mirrorApi);
mirrorApp.post(/mirror/, bodyParser.text(), bodyParser.json(), bodyParser.urlencoded({extended: true}), mirrorApi);

mirrorApp.use(errorHandler());


export const startMirrorServer = (): Server => {
  let mirrorServer = mirrorApp.listen(mirrorApp.get("port"), () => {
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
  return mirrorServer;
}