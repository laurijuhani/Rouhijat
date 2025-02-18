import { Response, NextFunction } from "express";
import { CustomRequest } from "./types";


// Used to get the client's IP address from cloudflare headers
const clientIp = (req: CustomRequest, _res: Response, next: NextFunction) => {
  const forwarded = req.headers['x-forwarded-for'] as string;
  req.clientIp = forwarded ? forwarded.split(/, /)[0] : req.connection.remoteAddress;
  next();
}; 

export default clientIp;