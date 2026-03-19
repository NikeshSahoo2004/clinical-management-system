import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { Clinician } from "../models/clinician.model";
import { ClinicianAuth } from "../models/clinicianAuth.model";
import {
  generateClinicianAccessToken,
  generateClinicianRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt";
import {
  ClinicianLoginRequest,
  ClinicianSignupRequest,
} from "../types/auth.types";

const SALT_ROUNDS = 10;

const COOKIE_OPTIONS = {
  httpOnly: true,  // From Frontend JS cann't be read/modify 
  secure: false,
  sameSite:"strict" as const, // Cross-site request for cookie be not allowed 
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

// SIGNUP 
export const signupClinician = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { fullName, email, phone, password, confirmPassword } =
      req.body as ClinicianSignupRequest;

    // basic validation
    if (!fullName || !email || !password || !confirmPassword) {
      res.status(400).json({
        message: "fullName, email, password and confirmPassword are required",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ message: "Invalid email format" });
      return;
    }

    if (password.length < 6) {
      res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
      return;
    }

    if (password !== confirmPassword) {
      res
        .status(400)
        .json({ message: "Password and confirmPassword do not match" });
      return;
    }

    // check if already exists
    const existingAuth = await ClinicianAuth.findOne({
      email: email.toLowerCase(),
    });

    if (existingAuth) {
      res
        .status(409)
        .json({ message: "Clinician with this email already exists" });
      return;
    }

    // create clinician
    const clinician = await Clinician.create({
      fullName,
      email: email.toLowerCase(),
      phone,
    });

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const payload = {
      clinicianId: clinician._id.toString(),
      email: clinician.email,
    };

    // generate tokens
    const accessToken = generateClinicianAccessToken(payload);
    const refreshToken = generateClinicianRefreshToken(payload);

    // store auth data
    await ClinicianAuth.create({
      clinicianId: clinician._id,
      email: clinician.email,
      password: hashedPassword,
      refreshToken,
    });

    res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);
    
    res.status(201).json({
      message: "Clinician registered successfully",
      accessToken,
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

// LOGIN 
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
    });

    if (!clinicianAuth) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    const isMatch = await bcrypt.compare(password, clinicianAuth.password);

    if (!isMatch) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    const clinician = await Clinician.findById(
      clinicianAuth.clinicianId
    );

    const payload = {
      clinicianId: clinicianAuth.clinicianId.toString(),
      email: clinicianAuth.email,
    };

    // generate new tokens (rotate refresh token)
    const accessToken = generateClinicianAccessToken(payload);
    const refreshToken = generateClinicianRefreshToken(payload);

    clinicianAuth.refreshToken = refreshToken;
    await clinicianAuth.save();

    res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);


    res.status(200).json({
      message: "Login successful",
      accessToken,
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
          },
    });
  } catch (error) {
    console.error("Error during clinician login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// REFRESH TOKEN
export const refreshAccessToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      res.status(400).json({ message: "Refresh token is required" });
      return;
    }

    // verify token
    const decoded = verifyRefreshToken(refreshToken);

    // check if token exists in DB
    const clinicianAuth = await ClinicianAuth.findOne({
      clinicianId: decoded.clinicianId,
      refreshToken,
    });

    if (!clinicianAuth) {
      res.status(401).json({ message: "Invalid refresh token" });
      return;
    }

    const payload = {
      clinicianId: decoded.clinicianId,
      email: decoded.email,
    };

    // rotate refresh token on each refresh
    const newAccessToken = generateClinicianAccessToken(payload);
    const newRefreshToken = generateClinicianRefreshToken(payload);
    clinicianAuth.refreshToken = newRefreshToken;
    await clinicianAuth.save();

    res.cookie("refreshToken", newRefreshToken, COOKIE_OPTIONS);
    
    res.status(200).json({
      message: "Token refreshed successfully",
      accessToken: newAccessToken,
    });
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      res
        .status(401)
        .json({ message: "Refresh token expired. Please login again." });
      return;
    }

    res.status(401).json({ message: "Invalid refresh token" });
  }
};


// LOGOUT - clearing the Cookie 
export const logoutClinician = async (
  req: Request,
  res: Response
): Promise<void> => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: false,
    sameSite: "strict" as const,
    path: "/",
  });
  res.status(200).json({ message: "Logged out successfully" });
};
