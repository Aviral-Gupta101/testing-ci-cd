import express from "express";
import { Request, Response, NextFunction } from "express";
import jwt, { Jwt } from "jsonwebtoken";

declare module "express-serve-static-core" {
    interface Request {
        userId?: string;
    }
}

interface JwtDecoded {
    userId: string,
    iat: number
}


export function authVerify(req: Request, res: Response, next: NextFunction) {


    if (!req.headers.authorization) {
        res.status(401).json({ message: "Token not found" });
        return;
    }

    const token = req.headers.authorization.split(" ")[1];

    try {

        const JWT_SECRET = process.env.JWT_SECRET as string;

        const decoded = jwt.verify(token, JWT_SECRET) as JwtDecoded;
        req.userId = decoded.userId;

        next();

    } catch (error) {

        res.status(401).json({ message: "Invalid token" });
    }

}