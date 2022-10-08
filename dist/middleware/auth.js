"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkUser = exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const doctorModel_1 = require("../model/doctorModel");
const secret = process.env.JWT_SECRET;
async function auth(req, res, next) {
    try {
        const authorization = req.cookies.authorized_doctor;
        if (!authorization) {
            if (req.headers["postman-token"]) {
                res.status(401).json({
                    Error: "Kindly sign in as a Doctor",
                });
            }
            else {
                res.status(401);
                res.redirect("/login");
            }
        }
        const token = authorization;
        let verified = jsonwebtoken_1.default.verify(token, secret);
        if (!verified) {
            return res
                .status(401)
                .json({ Error: "Doctor not verified, you can't access this route" });
        }
        const { doctor } = verified;
        const user = await doctorModel_1.DoctorsInstance.findOne({ where: { id: doctor } });
        if (!user) {
            return res.status(404).json({ Error: "Doctor not verified" });
        }
        res.locals.loggedIn = user;
        req.doctorId = doctor;
        next();
    }
    catch (error) {
        console.log(error);
    }
}
exports.auth = auth;
function checkUser(req, res, next) {
    try {
        if (res.locals.loggedIn) {
            next();
        }
        else {
            res.locals.loggedIn = null;
            next();
        }
    }
    catch (error) {
        console.log(error);
        res.locals.loggedIn = null;
        next();
    }
}
exports.checkUser = checkUser;
