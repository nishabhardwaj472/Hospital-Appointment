import validator from 'validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v2 as cloudinary } from 'cloudinary';
import userModel from '../models/userModel.js';
import doctorModel from '../models/doctorModel.js';
import appointmentModel from '../models/appointmentModel.js';

// ✅ Register User
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.json({ success: false, message: "Missing Details" });

    if (!validator.isEmail(email))
      return res.json({ success: false, message: "Enter a valid email" });

    if (password.length < 8)
      return res.json({ success: false, message: "Password must be at least 8 characters" });

    const existingUser = await userModel.findOne({ email });
    if (existingUser)
      return res.json({ success: false, message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await new userModel({ name, email, password: hashedPassword }).save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ✅ Login User
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user)
      return res.json({ success: false, message: 'User does not exist' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.json({ success: false, message: 'Invalid Credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ✅ Get User Profile
const getProfile = async (req, res) => {
  try {
    const userData = await userModel.findById(req.userId).select('-password');
    res.json({ success: true, userData });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ✅ Update Profile
const updateProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { name, phone, address, dob, gender } = req.body;
    const imageFile = req.file;

    if (!name || !phone || !dob || !gender || !address)
      return res.json({ success: false, message: "Data Missing" });

    let parsedAddress = typeof address === 'string' ? JSON.parse(address) : address;

    let formattedDob = dob;
    const parts = dob.split("-");
    if (parts.length === 3 && parts[0].length === 2) {
      formattedDob = `${parts[2]}-${parts[1]}-${parts[0]}`;
    }

    await userModel.findByIdAndUpdate(userId, {
      name,
      phone,
      address: parsedAddress,
      dob: formattedDob,
      gender,
    });

    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path);
      await userModel.findByIdAndUpdate(userId, { image: imageUpload.secure_url });
    }

    res.json({ success: true, message: "Profile Updated Successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ✅ Book Appointment
const bookAppointment = async (req, res) => {
  try {
    const { docId, slotDate, slotTime } = req.body;
    const userId = req.userId;

    const docData = await doctorModel.findById(docId).select('-password');
    if (!docData)
      return res.json({ success: false, message: 'Doctor not found' });

    if (!docData.available)
      return res.json({ success: false, message: 'Doctor not available' });

    const slots_booked = docData.slots_booked || {};
    if (slots_booked[slotDate]?.includes(slotTime))
      return res.json({ success: false, message: 'Slot already booked' });

    const alreadyBooked = await appointmentModel.findOne({ userId, docId, slotDate, slotTime });
    if (alreadyBooked)
      return res.json({ success: false, message: 'You already booked this slot' });

    if (!slots_booked[slotDate]) slots_booked[slotDate] = [];
    slots_booked[slotDate].push(slotTime);

    const userData = await userModel.findById(userId).select('-password');
    if (!userData) return res.json({ success: false, message: 'User not found' });

    const { slots_booked: _, ...docInfo } = docData.toObject();

    await new appointmentModel({
      userId,
      docId,
      userData,
      docData: docInfo,
      amount: docData.fees,
      slotTime,
      slotDate,
      date: Date.now(),
    }).save();

    await doctorModel.findByIdAndUpdate(docId, { slots_booked });

    res.json({ success: true, message: 'Appointment Booked' });
  } catch (error) {
    console.log("Booking error:", error);
    res.json({ success: false, message: error.message });
  }
};

// ✅ Toggle Doctor Availability
const toggleAvailability = async (req, res) => {
  try {
    const { docId, available } = req.body;
    await doctorModel.findByIdAndUpdate(docId, { available });
    res.json({ success: true, message: 'Availability status updated' });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ✅ Get User Appointments
const listAppointment = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({ userId: req.userId }).sort({ date: -1 });
    res.json({ success: true, appointments });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ✅ Cancel Appointment
const cancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const userId = req.userId;

    const appointmentData = await appointmentModel.findById(appointmentId);
    if (!appointmentData || appointmentData.userId.toString() !== userId)
      return res.json({ success: false, message: "Unauthorized or not found" });

    await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });

    const { docId, slotDate, slotTime } = appointmentData;
    const doctorData = await doctorModel.findById(docId);

    if (doctorData?.slots_booked?.[slotDate]) {
      doctorData.slots_booked[slotDate] = doctorData.slots_booked[slotDate].filter(s => s !== slotTime);
      if (doctorData.slots_booked[slotDate].length === 0) delete doctorData.slots_booked[slotDate];
      await doctorModel.findByIdAndUpdate(docId, { slots_booked: doctorData.slots_booked });
    }

    res.json({ success: true, message: "Appointment Cancelled" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ✅ Complete Appointment
const completeAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const userId = req.userId;

    const appointment = await appointmentModel.findById(appointmentId);
    if (!appointment || appointment.userId.toString() !== userId) {
      return res.json({ success: false, message: 'Unauthorized or appointment not found' });
    }

    if (appointment.isCompleted) {
      return res.json({ success: false, message: 'Appointment is already marked as completed' });
    }

    await appointmentModel.findByIdAndUpdate(appointmentId, { isCompleted: true });

    res.json({ success: true, message: 'Appointment marked as completed' });
  } catch (error) {
    console.log("Completion error:", error);
    res.json({ success: false, message: error.message });
  }
};

export {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  bookAppointment,
  toggleAvailability,
  listAppointment,
  cancelAppointment,
  completeAppointment
};
