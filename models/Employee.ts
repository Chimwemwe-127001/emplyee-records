import mongoose, { Schema } from "mongoose"

const EmployeeSchema = new Schema({
  firstName: {
    type: String,
    required: [true, "First name is required"],
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, "Last name is required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
  },
  phone: {
    type: String,
    required: [true, "Phone number is required"],
    trim: true,
  },
  role: {
    type: String,
    required: [true, "Role is required"],
    enum: ["Admin", "Staff"],
    default: "Staff",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

export default mongoose.models.Employee || mongoose.model("Employee", EmployeeSchema)

