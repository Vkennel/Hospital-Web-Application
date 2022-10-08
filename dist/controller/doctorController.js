"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutDoctor = exports.getDoctor = exports.LoginDoctor = exports.updateDoctor = exports.RegisterDoctor = void 0;
const uuid_1 = require("uuid");
const doctorModel_1 = require("../model/doctorModel");
const utils_1 = require("../utils/utils");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const hospitalReportModel_1 = require("../model/hospitalReportModel");
async function RegisterDoctor(req, res, next) {
    // create a todo
    const doctorId = (0, uuid_1.v4)();
    // let users = { ...req.body, id };
    let email = req.body.email;
    // console.log(email);
    try {
        const validateResult = utils_1.registerSchema.validate(req.body, utils_1.options);
        if (validateResult.error) {
            return res
                .status(400)
                .json({ Error: validateResult.error.details[0].message });
        }
        const duplicateEmail = await doctorModel_1.DoctorsInstance.findOne({
            where: { email: email },
        });
        // console.log(duplicateEmail);
        if (duplicateEmail) {
            return res.status(409).json({ msg: "Email has been used by another doctor" });
        }
        const duplicatePhoneNumber = await doctorModel_1.DoctorsInstance.findOne({
            where: { phoneNumber: req.body.phoneNumber },
        });
        if (duplicatePhoneNumber) {
            return res
                .status(409)
                .json({ msg: "Phone number has been used by another user" });
        }
        const passwordHash = await bcryptjs_1.default.hash(req.body.password, 8);
        const doctors = {
            id: doctorId,
            DoctorsName: req.body.DoctorsName,
            email: req.body.email,
            specialization: req.body.specialization,
            gender: req.body.gender,
            phoneNumber: req.body.phoneNumber,
            password: passwordHash,
        };
        const record = await doctorModel_1.DoctorsInstance.create(doctors);
        return res
            .status(200)
            .json({ msg: "You have successfully created a user", record });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            msg: "Failed to create user",
            route: "/register",
        });
    }
}
exports.RegisterDoctor = RegisterDoctor;
async function updateDoctor(req, res, next) {
    try {
        const bodyData = req.body;
        const { DoctorsName, email, specialization, gender, phoneNumber, password, confirm_password } = req.body;
        const validateResult = utils_1.updateDoctorSchema.validate(req.body, utils_1.options);
        if (validateResult.error) {
            return res.status(400).json({
                Error: validateResult.error.details[0].message
            });
        }
        const data = await doctorModel_1.DoctorsInstance.findOne({ where: { id: req.doctorId }
        });
        console.log(data);
        if (!data) {
            return res.status(404).json({
                Error: "Doctor not found"
            });
        }
        const updateRecord = await data.update({
            DoctorsName: DoctorsName,
            email: email,
            specialization: specialization,
            gender: gender,
            phoneNumber: phoneNumber,
            password: password,
            confirm_password: confirm_password,
        });
        res.status(200).json({
            msg: 'Data updated successfully',
            record: updateRecord
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "failed to update",
            error,
            route: '/'
        });
    }
}
exports.updateDoctor = updateDoctor;
async function LoginDoctor(req, res, next) {
    const doctorId = (0, uuid_1.v4)();
    try {
        const validateResult = utils_1.loginSchema.validate(req.body, utils_1.options);
        if (validateResult.error) {
            return res
                .status(400)
                .json({ Error: validateResult.error.details[0].message });
        }
        const doctor = await doctorModel_1.DoctorsInstance.findOne({
            where: { email: req.body.email },
        });
        // console.log(doctor);
        // as unknown as { [key: string]: string };
        if (!doctor) {
            return res.status(401).json({
                msg: "Doctor not found"
            });
        }
        else {
            // const  {id }  = doctor;
            const token = (0, utils_1.generateToken)(doctor.id);
            const validUser = await bcryptjs_1.default.compare(req.body.password, doctor.password);
            res.cookie('authorized_doctor', token, { httpOnly: true, maxAge: 1000 * 60 * 60 });
            if (!validUser) {
                res.status(401).json({
                    msg: "Incorrect password",
                });
            }
            if (validUser) {
                res.status(200).json({
                    msg: "Login Successfully",
                    token,
                    doctor,
                });
            }
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            msg: "Failed to login",
            route: "/login",
        });
    }
}
exports.LoginDoctor = LoginDoctor;
// GET all Todo list
async function getDoctor(req, res, next) {
    try {
        const limit = req.query.limit;
        const offset = req.query.offset;
        // console.log(req.doctorId);
        // const record = await TodoInstance.findAll({ where: {}, limit });
        const record = await doctorModel_1.DoctorsInstance.findOne({ where: { id: req.doctorId },
            limit, offset, include: [{ model: hospitalReportModel_1.patientInstance,
                    as: "Report",
                    attributes: [
                        "id",
                        "patientName",
                        "age",
                        "hospitalName",
                        "weight",
                        "height",
                        "bloodGroup",
                        "genotype",
                        "bloodPressure",
                        "HIV_status",
                        "hepatitis",
                        "createdAt"
                    ]
                }]
        });
        if (req.headers["postman-token"]) {
            res.status(200).json({
                msg: "You have successfully fetch doctor details",
                record
            });
        }
        else {
            res.render('index', { title: "Doctor Page", record });
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            msg: "Failed to fetch all Users",
            route: "/getDoctors"
        });
    }
}
exports.getDoctor = getDoctor;
// LOG OUT
async function logoutDoctor(req, res) {
    const isJSONResp = req.headers['postman-token'];
    if (isJSONResp) {
        if (!req.cookies.authorized_doctor) {
            return res.status(200).json({
                message: "successful",
            });
        }
    }
    else {
        if (!req.cookies.authorized_doctor) {
            // return res.redirect('/login')
        }
    }
    res.cookie('authorized_doctor', '', { maxAge: 1 });
    res.status(200).json({
        message: "successful",
    });
}
exports.logoutDoctor = logoutDoctor;
