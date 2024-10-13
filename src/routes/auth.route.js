import { Router } from "express";
//put js at the end whicle importing
import { register,loginUser, logoutUser,refreshAccessToken,getCurrentUser,updateCurrentDetails,getUserProfile} from "../controllers/auth.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.post('/register',register); 
router.post('/login',loginUser); 


//protected route
router.post('/logout',verifyJWT,logoutUser) 
router.get('/user',verifyJWT,getCurrentUser) 
router.get('/profile',verifyJWT,getUserProfile) 
router.post('/refresh-token',refreshAccessToken)
router.post('/update',verifyJWT,updateCurrentDetails) 

export default router;