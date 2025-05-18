import express from 'express';
import { addLecture, createCourse, deleteCourse, deleteLecture, getAllStats } from '../controllers/admin.js';
import { isAdmin, isAuth } from '../middlewares/isAuth.js';
import { uploadFiles } from '../middlewares/multer.js';

const router = express.Router();
router.post('/course/new', isAuth,isAdmin, uploadFiles, createCourse)
router.post('/course/:id', isAuth, isAdmin, uploadFiles, addLecture)
router.delete('/lecture/:id', isAuth, isAdmin, deleteLecture);
router.delete('/course/:id', isAuth, isAdmin, deleteCourse);
router.get('/stats', isAuth, isAdmin, getAllStats);


export default router;