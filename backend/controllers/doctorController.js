import doctorModel from "../models/doctorModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";

// ✅ Doctor Login
const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;
    const doctor = await doctorModel.findOne({ email });

    if (!doctor) {
      return res.json({ success: false, message: "Invalid Credentials" });
    }

    const isMatch = await bcrypt.compare(password, doctor.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid Credentials" });
    }

    const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({ success: true, token });
  } catch (error) {
    console.log("Login Error:", error);
    res.json({ success: false, message: error.message });
  }
};

// ✅ Get doctor list (for admin)
const doctorList = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select("-password -email");
    res.json({ success: true, doctors });
  } catch (error) {
    console.log("Doctor List Error:", error);
    res.json({ success: false, message: error.message });
  }
};

// ✅ Get doctor profile
const getDoctorProfile = async (req, res) => {
  try {
    const doctor = await doctorModel.findById(req.doctorId).select("-password");
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    res.json({ success: true, doctor });
  } catch (error) {
    console.log("Get Profile Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateDoctorProfile = async (req, res) => {
  try {
    const doctor = await doctorModel.findById(req.doctorId);

    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    const {
      name,
      phone,
      gender,
      dob,
      speciality,
      experience,
      degree,
      fees,
    } = req.body;

    if (name) doctor.name = name;
    if (phone) doctor.phone = phone;
    if (gender) doctor.gender = gender;
    if (dob) doctor.dob = dob;
    if (speciality) doctor.speciality = speciality;
    if (experience) doctor.experience = experience;
    if (degree) doctor.degree = degree;
    if (fees) doctor.fees = fees;

    // ✅ Safely parse address if needed
    if (req.body.address) {
      try {
        const parsed = typeof req.body.address === 'string'
          ? JSON.parse(req.body.address)
          : req.body.address;
        doctor.address = parsed;
      } catch (err) {
        return res.status(400).json({ success: false, message: 'Invalid address format' });
      }
    }

    // ✅ Handle image upload
    if (req.file) {
      doctor.image = `/uploads/${req.file.filename}`;
    }

    await doctor.save();

    res.json({ success: true, doctor, message: 'Doctor profile updated successfully' });
  } catch (error) {
    console.error('❌ Doctor update error:', error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};


// ✅ Toggle availability
const changeAvailability = async (req, res) => {
  try {
    const doctor = await doctorModel.findById(req.doctorId);
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    doctor.available = !doctor.available;
    await doctor.save();

    res.json({
      success: true,
      message: `Availability changed to ${doctor.available ? "Available" : "Unavailable"}`,
      available: doctor.available,
    });
  } catch (error) {
    console.log("Availability Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get appointments for doctor
const appointmentsDoctor = async (req, res) => {
  try {
    const appointments = await appointmentModel
      .find({ docId: req.doctorId })
      .populate("userId", "name image dob");

    const updatedAppointments = appointments.map((item) => ({
      _id: item._id,
      slotDate: item.slotDate,
      slotTime: item.slotTime,
      amount: item.amount,
      cancelled: item.cancelled,
      payment: item.payment,
      isCompleted: item.isCompleted,
      createdAt: item.createdAt,
      userData: {
        _id: item.userId?._id || "",
        name: item.userId?.name || "Unknown",
        image: item.userId?.image || "/default-user.png",
        dob: item.userId?.dob || null,
      },
    }));

    return res.json({ success: true, appointments: updatedAppointments });
  } catch (error) {
    console.log("Doctor Appointments Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Cancel appointment
const cancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    const appointment = await appointmentModel.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    if (appointment.cancelled) {
      return res.json({ success: false, message: "Already cancelled" });
    }

    appointment.cancelled = true;
    await appointment.save();

    res.json({ success: true, message: "Appointment cancelled" });
  } catch (error) {
    console.log("Cancel Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Doctor Dashboard (stats + latest 5 bookings)
const dashboardDoctor = async (req, res) => {
  try {
    const doctor = await doctorModel.findById(req.doctorId).select("-password");
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    const allAppointments = await appointmentModel
      .find({ docId: req.doctorId })
      .populate("userId", "name image");

    const total = allAppointments.length;
    const cancelled = allAppointments.filter((a) => a.cancelled).length;
    const active = total - cancelled;

    const uniquePatients = new Set(
      allAppointments.map((a) => a.userId?._id?.toString())
    ).size;

    const latestAppointments = allAppointments
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 5)
      .map((app) => ({
        userName: app.userId?.name || "Unknown",
        userImage: app.userId?.image || "",
        date: new Date(app.date).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
        status: app.cancelled ? "Cancelled" : "Active",
      }));

    res.json({
      success: true,
      data: {
        doctor,
        stats: {
          total,
          active,
          cancelled,
          patients: uniquePatients,
        },
        latestAppointments,
      },
    });
  } catch (error) {
    console.log("Dashboard Error:", error);
    res.status(500).json({ success: false, message: "Failed to load dashboard data" });
  }
};

export {
  loginDoctor,
  doctorList,
  getDoctorProfile,
  updateDoctorProfile,
  changeAvailability,
  appointmentsDoctor,
  cancelAppointment,
  dashboardDoctor,
};
