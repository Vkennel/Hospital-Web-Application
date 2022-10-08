"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const doctorController_1 = require("../controller/doctorController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.get('/home', auth_1.auth, doctorController_1.getDoctor);
router.get('/', (req, res) => {
    res.redirect('login');
});
router.get('/reports/create', auth_1.auth, (req, res) => {
    res.render('createReport', { title: 'Create Report' });
});
router.get('/doctor/:id', auth_1.auth, (req, res) => {
    res.render('update_doctor', { title: 'Doctor' });
});
router.get('/login', (req, res) => {
    res.render('login', { title: "login" });
});
router.get('/signup', (req, res) => {
    res.render('signUp', { title: "Sign Up" });
});
exports.default = router;
