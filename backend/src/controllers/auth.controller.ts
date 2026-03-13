import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { Clinician } from "../models/clinician.model";
import { ClinicianAuth } from "../models/clinicianAuth.model";
import { generateClinicianToken } from "../utils/jwt";
import {
  ClinicianLoginRequest,
  ClinicianSignupRequest,
} from "../types/auth.types";

const SALT_ROUNDS = 10;

export const signupClinician = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      fullName,
      email,
      phone,
      password,
      confirmPassword,
    } = req.body as ClinicianSignupRequest;

    // Basic validation
    if (!fullName || !email || !password || !confirmPassword) {
      res.status(400).json({ message: "fullName, email, password and confirmPassword are required" });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ message: "Invalid email format" });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ message: "Password must be at least 6 characters long" });
      return;
    }

    if (password !== confirmPassword) {
      res.status(400).json({ message: "Password and confirmPassword do not match" });
      return;
    }

    // Check if clinician auth already exists by email
    const existingAuth = await ClinicianAuth.findOne({
      email: email.toLowerCase(),
    }).exec();
    if (existingAuth) {
      res.status(409).json({ message: "Clinician with this email already exists" });
      return;
    }

    // Create clinician profile
    const clinician = await Clinician.create({
      fullName,
      email: email.toLowerCase(),
      phone,
    });

    // Hash password and store in separate auth collection
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    await ClinicianAuth.create({
      clinicianId: clinician._id,
      email: clinician.email,
      password: hashedPassword,
    });

    const token = generateClinicianToken({
      clinicianId: clinician._id.toString(),
      email: clinician.email,
    });

    res.status(201).json({
      message: "Clinician registered successfully",
      token,
      clinician: {
        id: clinician._id,
        fullName: clinician.fullName,
        email: clinician.email,
        phone: clinician.phone,
      },
    });
  } catch (error) {
    console.error("Error during clinician signup:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const loginClinician = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body as ClinicianLoginRequest;

    if (!email || !password) {
      res.status(400).json({ message: "Email and password are required" });
      return;
    }

    const clinicianAuth = await ClinicianAuth.findOne({
      email: email.toLowerCase(),
    }).exec();

    if (!clinicianAuth) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    const isMatch = await bcrypt.compare(password, clinicianAuth.password);
    if (!isMatch) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    const clinician = await Clinician.findById(clinicianAuth.clinicianId).exec();

    const token = generateClinicianToken({
      clinicianId: clinicianAuth.clinicianId.toString(),
      email: clinicianAuth.email,
    });

    res.status(200).json({
      message: "Login successful",
      token,
      clinician: clinician
        ? {
            id: clinician._id,
            fullName: clinician.fullName,
            email: clinician.email,
            phone: clinician.phone,
          }
        : {
            id: clinicianAuth.clinicianId,
            fullName: "",
            email: clinicianAuth.email,
            phone: undefined,
          },
    });
  } catch (error) {
    console.error("Error during clinician login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

