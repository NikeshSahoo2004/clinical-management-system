import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";


//Check if Authorization header exists
export interface AuthRequest extends Request {
  user?: any;
}


export const protectRoute = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "Unauthorized: No token provided or invalid format",
      });
    }
    //extracting token
     const token = authHeader.split(" ")[1];


     //checking secret key from environment 
     const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      console.error("JWT_SECRET is not configured in .env");
      return res.status(500).json({ error: "Server Configuration Error" });
    }
    
    //Token Validate (Verify)
    const decoded = jwt.verify(token, JWT_SECRET);

    //decoded data 
    req.user = decoded;

    //sending the request to next route/controller
    next();
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Unauthorized User: Token expired" });
    }
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};
