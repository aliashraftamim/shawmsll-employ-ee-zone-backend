/* eslint-disable no-useless-escape */
import { NextFunction, Request, Response } from "express";
import { toolQueue } from "../background-worker/queue";

export const mostUsesTool = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req.endpoint = req.originalUrl;

  const prefix = "/api/v1/";
  let titleToMatch = req.endpoint;

  if (req.endpoint.startsWith(prefix)) {
    titleToMatch = req.endpoint.slice(prefix.length);
    titleToMatch = titleToMatch.split(/[/\?]/)[0];
  }

  // 🚀 Job add to queue
  await toolQueue.add("incrementTool", { title: titleToMatch });

  next();
};
