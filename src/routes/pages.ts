import express from 'express'
import { 
    getPatientRecord,
  } from "../controller/hospitalReportController";
  import {RegisterDoctor, LoginDoctor,getDoctor} from '../controller/doctorController'
  import { auth } from "../middleware/auth";

const router = express.Router()

router.get('/home', auth, getDoctor)

router.get('/', (req, res)=>{
    res.redirect('login')
})

router.get('/reports/create', auth, (req, res)=>{
    res.render('createReport', {title:'Create Report'})
})

router.get('/doctor/:id', auth, (req, res)=>{
    res.render('update_doctor', {title:'Doctor'})
})


router.get('/login',(req, res)=>{
    res.render('login', {title:"login"})
})

router.get('/signup',(req, res)=>{
    res.render('signUp', {title:"Sign Up"})
})

export default router