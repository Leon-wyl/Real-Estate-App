import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response } from "express";

export const shouldBeLoggedIn = (req: Request, res: Response) => {
  console.log(req.userId);
  res.status(200).json({ message: "You are authenticated" });
};

export const shouldBeAdmin = (req: Request, res: Response) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Not Authenticated!" });
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY!, (err: jwt.VerifyErrors | null, payload: string | jwt.JwtPayload | undefined) => {
    if (err) {
      return res.status(403).json({ message: "Token not valid!" });
    }
    
    if (payload && typeof payload !== "string" && !(payload as JwtPayload).isAdmin) {
      return res.status(403).json({ message: "Not authorized!" });
    }

    res.status(200).json({ message: "You are authenticated" });
  });
};
