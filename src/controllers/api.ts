"use strict";

import { NextFunction, Request, Response } from "express";

/**
 * GET /api
 * List of API examples.
 */
export const getApi = (req: Request, res: Response) => {
  res.send('Hello World!')
};
