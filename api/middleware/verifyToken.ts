import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Not Authenticated!" });
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY!, (err: jwt.VerifyErrors | null, payload: string | jwt.JwtPayload | undefined) => {
    if (err) {
      return res.status(403).json({ message: "Token not valid!" });
    }
    
    if (payload && typeof payload !== "string") {
      req.userId = (payload as JwtPayload).id;
    }

    next();
  });
};
