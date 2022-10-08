import express, { Request, Response, NextFunction } from "express";
import { v4 as UUID4 } from "uuid";
import { DoctorsInstance } from "../model/doctorModel";
import {
  registerSchema,
  loginSchema,
  options,
  generateToken,
  updateDoctorSchema
} from "../utils/utils";
import bcrypt from "bcryptjs";
import { patientInstance } from "../model/hospitalReportModel";


export async function RegisterDoctor(
  req: Request,
  res: Response,
  next: NextFunction
  ) {
    // create a todo
    const doctorId = UUID4();
    // let users = { ...req.body, id };
    let email = req.body.email;
    // console.log(email);
    
    try {
      const validateResult = registerSchema.validate(req.body, options);
      if (validateResult.error) {
        return res
        .status(400)
        .json({ Error: validateResult.error.details[0].message });
      }
      
      const duplicateEmail = await DoctorsInstance.findOne({
        where: { email:email},
      });
      // console.log(duplicateEmail);
      
            if (duplicateEmail) {
       return res.status(409).json({ msg: "Email has been used by another doctor" });
      }
      
    const duplicatePhoneNumber = await DoctorsInstance.findOne({
      where: { phoneNumber: req.body.phoneNumber },
    });

    if (duplicatePhoneNumber) {
    return  res
        .status(409)
        .json({ msg: "Phone number has been used by another user" });
    }

    const passwordHash = await bcrypt.hash(req.body.password, 8);

    const doctors = {
      id: doctorId,
      DoctorsName: req.body.DoctorsName,
      email: req.body.email,
      specialization: req.body.specialization,
      gender: req.body.gender,
      phoneNumber: req.body.phoneNumber,
      password: passwordHash,
    };

    const record = await DoctorsInstance.create(doctors);

   return res
      .status(200)
      .json({ msg: "You have successfully created a user", record });
      
  } catch (err) {
    console.log(err);
    
    res.status(500).json({
      msg: "Failed to create user",
      route: "/register",
    });
  }
}

export async function updateDoctor(req:Request, res:Response, next:NextFunction){
  try {
    //  const bodyData = req.body 
     const {
      DoctorsName,
      email,
      specialization,
      gender,
      phoneNumber,
      password,
      confirm_password
    } = req.body;

     const validateResult = updateDoctorSchema.validate(req.body, options)

     if(validateResult.error){ 
         return res.status(400).json({
             Error:validateResult.error.details[0].message
         })
     }
      const data = await DoctorsInstance.findOne({where:{id:req.doctorId}
        
      }) 
      console.log(data);

      if(!data){
          return res.status(404).json({
              Error:"Doctor not found"
          })
      }
      const updateRecord = await data.update({ 
        DoctorsName:DoctorsName,
        email:email,
        specialization:specialization,
        gender:gender,
        phoneNumber:phoneNumber,
        password:password,
        confirm_password:confirm_password,
      })
      res.status(200).json({
          msg:'Data updated successfully',
          record: updateRecord
      })
  } catch (error) {
    console.log(error);
    
      res.status(500).json({
          msg:"failed to update",
          error,
          route:'/'
      })
  }
}





export async function LoginDoctor(
  req: Request,
  res: Response,
  next: NextFunction
  ) {
    const doctorId = UUID4(); 
    try {
      
      
      const validateResult = loginSchema.validate(req.body, options);

      
      if (validateResult.error) {
        return res
        .status(400)
        .json({ Error: validateResult.error.details[0].message });
      }
      
      const doctor = await DoctorsInstance.findOne({
        where: { email: req.body.email },
      })
      // console.log(doctor);
      
      // as unknown as { [key: string]: string };
      if(!doctor){
        return res.status(401).json({
          msg:"Doctor not found"
        })
      }else{        
      // const  {id }  = doctor;
      const token = generateToken( doctor.id );
      const validUser = await bcrypt.compare(req.body.password, doctor.password);
      res.cookie('authorized_doctor', token, {httpOnly:true, maxAge:1000 * 60 * 60})
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
    } catch (err) {
      console.log(err)
      res.status(500).json({
        msg: "Failed to login",
        route: "/login",
    });
  }
}

// GET all Todo list
export async function getDoctor(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {

    
    const limit = req.query.limit as number | undefined;
    const offset = req.query.offset as number | undefined;
    // console.log(req.doctorId);
    
    // const record = await TodoInstance.findAll({ where: {}, limit });
    const record = await DoctorsInstance.findOne({where:{id:req.doctorId}, 
      limit, offset,include: 
      [{ model: patientInstance, 
        as: "Report",
        attributes:[
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
        "createdAt"]
      }]
      });

      if(req.headers["postman-token"]){
        res.status(200).json({
          msg: "You have successfully fetch doctor details",
          record
        });
      }else{
        res.render('index', {title:"Doctor Page", record})
      }
 
  } catch (err) {
    console.log(err);
    
    res.status(500).json({
      msg: "Failed to fetch all Users",
      route: "/getDoctors"
    });
  }
}

// LOG OUT
export async function logoutDoctor(req:Request, res:Response){
  const isJSONResp = req.headers['postman-token']
  if (isJSONResp){
      
      if(!req.cookies.authorized_doctor){
         return res.status(200).json({
              message:"successful",
          })
      }
  }else{
      if(!req.cookies.authorized_doctor){
          // return res.redirect('/login')
      }
  }
 
  res.cookie('authorized_doctor', '', {maxAge:1})
  res.status(200).json({
      message:"successful",
  })
}