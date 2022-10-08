"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const hospitalReportController_1 = require("../controller/hospitalReportController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
/* GET Todos. */
router.post("/create", auth_1.auth, hospitalReportController_1.PatientRecord);
router.get("/read", hospitalReportController_1.getPatientRecord);
router.get("/read/:id", auth_1.auth, hospitalReportController_1.getSinglePatientRecord);
router.patch("/update/:id", auth_1.auth, hospitalReportController_1.updatePatientRecord);
router.delete("/delete/:id", auth_1.auth, hospitalReportController_1.deletePatientRecord);
exports.default = router;
