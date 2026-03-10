import { Request, Response } from "express";
import { pool } from "../db/db";

export const createClinician = async (req: Request, res: Response) => {
 try {

  const {
    firstName,
    lastName,
    title,
    licenseNumber,
    specialty,
    email,
    phone
  } = req.body;

  const result = await pool.query(
   `INSERT INTO clinicians
   (first_name,last_name,title,license_number,specialty,email,phone)
   VALUES($1,$2,$3,$4,$5,$6,$7)
   RETURNING *`,
   [firstName,lastName,title,licenseNumber,specialty,email,phone]
  );

  const clinician = result.rows[0];

  const response = {
   id: clinician.id,

   name: {
    firstName: clinician.first_name,
    lastName: clinician.last_name,
    title: clinician.title
   },

   credentials: {
    licenseNumber: clinician.license_number,
    specialty: clinician.specialty,
    certifications: []
   },

   contact: {
    email: clinician.email,
    phone: clinician.phone,
    officeAddress: {
     street: null,
     city: null,
     state: null,
     postalCode: null,
     country: null
    }
   },

   availability: [],

   createdAt: clinician.created_at,
   updatedAt: clinician.created_at
  };

  res.json(response);

 } catch (error) {
  console.error(error);
  res.status(500).json({ message: "Error creating clinician" });
 }
};

export const getClinician = async (req: Request, res: Response) => {

 const id = req.params.id;

 const result = await pool.query(
  "SELECT * FROM clinicians WHERE id=$1",
  [id]
 );

 res.json(result.rows[0]);
};