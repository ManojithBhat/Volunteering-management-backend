import {Router} from 'express';
import { addEvent,updateEvent,deleteEvent,addEventUsers,getEventDetails,getEvent} from '../controllers/event.controller.js';
import { verifyRole}  from '../middleware/role.middleware.js';

const router = Router();

//protected route 
router.post('/add-event',verifyRole,addEvent);
router.post('/update-event/:id',verifyRole,updateEvent)
router.delete('/delete-event/:id',verifyRole,deleteEvent)
router.post('/add-volunteers/:eventId',verifyRole,addEventUsers)
router.get('/events/:eventId',getEventDetails)
router.get('/events',getEvent);

export default router;