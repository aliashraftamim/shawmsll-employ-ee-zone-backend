/* eslint-disable no-useless-escape */
/* eslint-disable no-console */
import { NextFunction, Request, Response } from "express";
import { TopUsedTools } from "../../modules/contextual/top-used-tools/top-used-tools.model";

export const endpointDetector = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1️⃣ Endpoint detect
    req.endpoint = req.originalUrl;

    // 2️⃣ Strip '/api/v1/' prefix
    const prefix = "/api/v1/";
    let titleToMatch = req.endpoint;

    if (req.endpoint.startsWith(prefix)) {
      // '/api/v1/communication-toolkit/6880b8f74a9ef8e5c16d14b2' -> 'communication-toolkit/6880b8f74a9ef8e5c16d14b2'
      titleToMatch = req.endpoint.slice(prefix.length);

      titleToMatch = titleToMatch.split(/[/\?]/)[0];
    }

    // 3️⃣ Find matching tool by title
    const tool = await TopUsedTools.findOne({ title: titleToMatch });

    if (tool) {
      // 4️⃣ Increment priority (atomic way)
      await TopUsedTools.findByIdAndUpdate(
        tool._id,
        { $inc: { priority: 1 } },
        { new: true }
      );
      console.log(`✅ Priority enhanced for ${tool.title}`);
    }

    if (req.method === "POST") {
      console.log("This is a POST request");
    }

    next();
  } catch (err) {
    console.error("Error in endpointDetector middleware:", err);
    next();
  }
};
