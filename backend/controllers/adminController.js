import validator from "validator";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";
import userModel from "../models/userModel.js";

// ✅ Add Doctor
const addDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      speciality,
      degree,
      experience,
      about,
      fees,
      address,
    } = req.body;
    const imageFile = req.file;

    if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address) {
      return res.json({ success: false, message: "Missing Details" });
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Please enter a valid email" });
    }

    if (password.length < 8) {
      return res.json({ success: false, message: "Please enter a strong password" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });
    const imageUrl = imageUpload.secure_url;

    const doctorData = {
      name,
      email,
      image: imageUrl,
      password: hashedPassword,
      speciality,
      degree,
      experience,
      about,
      fees,
      address: JSON.parse(address),
      date: Date.now(),
    };

    const newDoctor = new doctorModel(doctorData);
    await newDoctor.save();

    res.json({ success: true, message: "Doctor Added" });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ✅ Admin Login (updated token format)
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const token = jwt.sign(
        { email }, // 👈 structured payload
        process.env.JWT_SECRET,
        { expiresIn: '1d' } // optional expiration
      );
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ✅ Get All Doctors
const allDoctors = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select("-password");
    res.json({ success: true, doctors });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ✅ Get All Appointments
const appointmentsAdmin = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({})
      .populate("userId", "name dob")
      .populate("docId", "name fees");

    res.json({ success: true, appointments });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ✅ Cancel Appointment
const cancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    const appointmentData = await appointmentModel.findByIdAndUpdate(appointmentId, {
      cancelled: true,
    });

    if (!appointmentData) {
      return res.json({ success: false, message: "Appointment not found" });
    }

    const { docId, slotDate, slotTime } = appointmentData;

    const doctorData = await doctorModel.findById(docId);
    if (doctorData?.slots_booked?.[slotDate]) {
      doctorData.slots_booked[slotDate] = doctorData.slots_booked[slotDate].filter(
        (t) => t !== slotTime
      );

      if (doctorData.slots_booked[slotDate].length === 0) {
        delete doctorData.slots_booked[slotDate];
      }

      await doctorModel.findByIdAndUpdate(docId, {
        slots_booked: doctorData.slots_booked,
      });
    }

    res.json({ success: true, message: "Appointment Cancelled" });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ✅ Complete Appointment
const completeAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    const updated = await appointmentModel.findByIdAndUpdate(appointmentId, {
      isCompleted: true,
    });

    if (!updated) {
      return res.json({ success: false, message: "Appointment not found" });
    }

    res.json({ success: true, message: "Appointment marked as completed" });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ✅ Dashboard Data for Admin Panel
// ✅ Dashboard Data for Admin Panel
const adminDashbord = async (req, res) => {
  try {
    console.log("📊 Dashboard API hit");

    const doctors = await doctorModel.find({});
    const users = await userModel.find({});
    const appointments = await appointmentModel.find({});

    const dashData = {
      doctors: doctors.length,
      appointments: appointments.length,
      patients: users.length,
      latestAppointments: appointments.reverse().slice(0, 5),
    };

    res.json({ success: true, data: dashData }); // ✅ CHANGED HERE: key is now 'data'

  } catch (error) {
    console.log("❌ Dashboard error:", error);
    res.json({ success: false, message: error.message });
  }
};


// ✅ Change Doctor Availability
const changeAvailability = async (req, res) => {
  try {
    const { docId } = req.body;

    const doctor = await doctorModel.findById(docId);
    if (!doctor) {
      return res.json({ success: false, message: "Doctor not found" });
    }

    doctor.available = !doctor.available;
    await doctor.save();

    res.json({
      success: true,
      message: `Doctor availability updated to ${doctor.available ? "Available" : "Unavailable"}`,
      available: doctor.available
    });
  } catch (error) {
    console.log("❌ Change Availability Error:", error);
    res.json({ success: false, message: error.message });
  }
};


export {
  addDoctor,
  loginAdmin,
  allDoctors,
  appointmentsAdmin,
  cancelAppointment,
  completeAppointment,
  adminDashbord,
  changeAvailability
};
