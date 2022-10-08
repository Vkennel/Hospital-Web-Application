import express from "express";
import {
  PatientRecord,
  getPatientRecord,
  getSinglePatientRecord,
  updatePatientRecord,
  deletePatientRecord,
} from "../controller/hospitalReportController";
import { auth } from "../middleware/auth";

const router = express.Router();

/* GET Todos. */
router.post("/create", auth, PatientRecord);
router.get("/read", getPatientRecord);
router.get("/read/:id", auth, getSinglePatientRecord);
router.patch("/update/:id", auth, updatePatientRecord);
router.delete("/delete/:id", auth, deletePatientRecord);

export default router;
