"use strict";

import { Request, Response } from "express";

//Mirror REST
export const mirrorApi = (req: Request, res: Response) => {
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
