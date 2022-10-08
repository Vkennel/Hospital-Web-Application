import express from 'express'
import {RegisterDoctor, LoginDoctor,logoutDoctor, getDoctor, updateDoctor} from '../controller/doctorController'
import { auth } from "../middleware/auth";

const router = express.Router();

router.post('/register',RegisterDoctor)
router.put('/update', auth, updateDoctor)
router.post('/login',LoginDoctor)
router.get('/logout',logoutDoctor)

router.get('/alldoctors', auth, getDoctor)



export default router;
