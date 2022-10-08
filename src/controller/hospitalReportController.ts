import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import { DoctorsInstance } from "../model/doctorModel";
import { patientInstance } from "../model/hospitalReportModel";
import {
  createPatientSchema,
  options,
  updatePatientSchema,
} from "../utils/utils";

export async function PatientRecord(
  req: Request | any,
  res: Response,
  next: NextFunction
) {
  // create a todo
  const id = uuidv4();
  // let patient = { ...req.body, id };
  try {
    const verified = req.doctorId;
    const validateResult = createPatientSchema.validate(req.body, options);
    if (validateResult.error) {
      return res
        .status(400)
        .json({ Error: validateResult.error.details[0].message });
    }
    const record = await patientInstance.create({
      id,
      ...req.body,
      doctorId: verified,
    });
    res.status(201);
    res.json({ msg: "You have successfully created a patient report", record });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      msg: "Failed to create patient report",
      route: "/create",
    });
  }
}

// GET all Todo list
export async function getPatientRecord(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const limit = req.query.limit as number | undefined;
    const offset = req.query.offset as number | undefined;

    const record = await patientInstance.findAndCountAll({
      limit,
      offset,
      include: [
        {
          model: DoctorsInstance,
          as: "Doctors",
          attributes: ["id", "DoctorsName"],
        },
      ],
    });

    const postmanReq = req.headers["postman-token"];
    if (postmanReq) {
      res.status(200).json({
        msg: "You have successfully fetch all patient report",
        count: record.count,
        record: record.rows,
      });
    }else{
      res.render("index", { record: record.rows, title:'Doctor Report' });
    }

  } catch (err) {
    console.log(err);

    res.status(500).json({
      msg: "Failed to fetch all patient report",
      route: "/read",
    });
  }
}

// GET Single Todo
export async function getSinglePatientRecord(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // const id = req.params.id;
    // OR
    const { id } = req.params;
    const record = await patientInstance.findOne({ where: { id } });
    if(req.headers["postman-token"]){
      res
      .status(200)
      .json({ msg: "You have successfully find your patient report", record });
    }else{
      res.status(200)
      res.render('singleReport', {title:`${record.patientName} Record`, record})
    }
   
  } catch (err) {
    res.status(500).json({
      msg: "Failed to read single patient report",
      route: "/read/:id",
    });
  }
}

/* UPDATE Todos listing. */
export async function updatePatientRecord(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // create a todo

  try {
    const { id } = req.params;
    const {
      patientName,
      age,
      hospitalName,
      weight,
      height,
      bloodGroup,
      genotype,
      bloodPressure,
      HIV_status,
      hepatitis,
    } = req.body;
    const validateResult = updatePatientSchema.validate(req.body, options);
    if (validateResult.error) {
      return res
        .status(400)
        .json({ Error: validateResult.error.details[0].message });
    }

    const record = await patientInstance.findOne({ where: { id, doctorId:req.doctorId } });
    if (!record) {
      return res.status(404).json({
        Error: "Cannot find existing patient report",
      });
    }
    const updatedRecord = await record.update({
      patientName: patientName,
      age: age,
      hospitalName: hospitalName,
      weight: weight,
      height: height,
      bloodGroup: bloodGroup,
      genotype: genotype,
      bloodPressure: bloodPressure,
      HIV_status: HIV_status,
      hepatitis: hepatitis,
    });
    res.status(202).json({
      msg: "You have successfully updated your patient report",
      record: updatedRecord,
    });
  } catch (err) {
    res.status(500).json({
      msg: "Failed to update patient report",
      route: "/update/:id",
    });
  }
}

// DELETE Todo
export async function deletePatientRecord(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    //  const id = req.params.id    OR
    const { id } = req.params;
    const record = await patientInstance.findOne({ where: { id, doctorId: req.doctorId } });
    if (!record) {
      return res.status(404).json({ msg: "Can not find patient report" });
    }
    const deletedRecord = await record.destroy();
    return res
      .status(200)
      .json({ msg: "Successfully deleted patient report", deletedRecord });
  } catch (err) {
    res.status(500).json({
      msg: "Failed to delete patient report",
      route: "/delete/:id",
    });
  }
}
