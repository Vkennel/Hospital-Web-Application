import express, { Request, Response, NextFunction } from "express";
import { string } from "joi";
import jwt from "jsonwebtoken";
import { DoctorsInstance } from "../model/doctorModel";

const secret = process.env.JWT_SECRET as string;

export async function auth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authorization = req.cookies.authorized_doctor;


    if (!authorization) {
      if (req.headers["postman-token"]) {
        res.status(401).json({
          Error: "Kindly sign in as a Doctor",
        });
      } else {
        res.status(401);
        res.redirect("/login");
      }
    }
    const token = authorization;

    let verified = jwt.verify(token, secret);

    if (!verified) {
      return res
        .status(401)
        .json({ Error: "Doctor not verified, you can't access this route" });
    }

    const { doctor } = verified as { [key: string]: string };

    const user = await DoctorsInstance.findOne({ where: { id:doctor } });

    if (!user) {
      return res.status(404).json({ Error: "Doctor not verified" });
    }
    res.locals.loggedIn = user;

    
    req.doctorId = doctor;
    next();
  } catch (error) { 
console.log(error);

  }
}

export function checkUser(req: Request, res: Response, next: NextFunction) {
  try {
    if (res.locals.loggedIn) {
      next();
    } else {
      res.locals.loggedIn = null;
      next()
    }
  } catch (error) {
    console.log(error);

    res.locals.loggedIn = null;
    next();
  }
}
