import express from 'express';
import {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  bookAppointment,
  listAppointment,
  toggleAvailability,
  cancelAppointment,
  completeAppointment  // ✅ Make sure this exists
} from '../controllers/userController.js';
import authUser from '../middlewares/authUser.js';
import upload from '../middlewares/multer.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.get('/get-profile', authUser, getProfile);
userRouter.post('/update-profile', authUser, upload.single('image'), updateProfile);
userRouter.post('/book-appointment', authUser, bookAppointment);
userRouter.get('/appointments', authUser, listAppointment);
userRouter.post('/toggle-availability', authUser, toggleAvailability);

// ✅ Changed POST → PUT to match frontend
userRouter.post('/cancel-appointment', authUser, cancelAppointment);

// ✅ Add this if handling complete appointment
userRouter.put('/complete-appointment', authUser, completeAppointment);

export default userRouter;
