import createError from "http-errors";
import express, { Request, Response, NextFunction } from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import db from "./config/database.config";

db.sync()
  .then(() => {
    console.log(`Database connected successfully`);
  })
  .catch((err) => console.log(err));

import pagesRouter from "./routes/pages";
import doctorRouter from "./routes/doctors";
import reportRouter from "./routes/reports";
import signUpRouter from "./routes/signUp";
import { checkUser } from "./middleware/auth";

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "..", "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join("public")));

app.get('*', checkUser)
app.use("/", pagesRouter);
app.use("/", signUpRouter);
app.use("/doctors", doctorRouter);
app.use("/reports", reportRouter);

// catch 404 and forward to error handler
app.use(function (req: Request, res: Response, next: NextFunction) {
  next(createError(404));
});

// error handler
app.use(function (
  err: createError.HttpError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

export default app;
