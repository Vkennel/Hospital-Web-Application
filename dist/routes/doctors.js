"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const doctorController_1 = require("../controller/doctorController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.post('/register', doctorController_1.RegisterDoctor);
router.put('/update', auth_1.auth, doctorController_1.updateDoctor);
router.post('/login', doctorController_1.LoginDoctor);
router.get('/logout', doctorController_1.logoutDoctor);
router.get('/alldoctors', auth_1.auth, doctorController_1.getDoctor);
exports.default = router;
