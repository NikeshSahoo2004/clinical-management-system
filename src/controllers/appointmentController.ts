import { Request, Response } from "express";
import * as appointmentService from "../services/appointmentService";
import { AppointmentQuery } from "../types/appointmentTypes";

export async function getAll(req: Request, res: Response): Promise<void> {
  try {
    const query: AppointmentQuery = {
      page: req.query.page ? parseInt(req.query.page as string, 10) : undefined,
      limit: req.query.limit ? parseInt(req.query.limit as string, 10) : undefined,
      status: req.query.status as AppointmentQuery["status"],
      doctor_name: req.query.doctor_name as string,
      patient_name: req.query.patient_name as string,
      date: req.query.date as string,
    };

    const result = await appointmentService.getAllAppointments(query);
    res.json(result);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getById(req: Request, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id as string, 10);
    const appointment = await appointmentService.getAppointmentById(id);

    if (!appointment) {
      res.status(404).json({ error: "Appointment not found" });
      return;
    }

    res.json(appointment);
  } catch (error) {
    console.error("Error fetching appointment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function create(req: Request, res: Response): Promise<void> {
  try {
    const appointment = await appointmentService.createAppointment(req.body);
    res.status(201).json(appointment);
  } catch (error) {
    console.error("Error creating appointment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function update(req: Request, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id as string, 10);
    const appointment = await appointmentService.updateAppointment(id, req.body);

    if (!appointment) {
      res.status(404).json({ error: "Appointment not found" });
      return;
    }

    res.json(appointment);
  } catch (error) {
    console.error("Error updating appointment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function remove(req: Request, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id as string, 10);
    const deleted = await appointmentService.deleteAppointment(id);

    if (!deleted) {
      res.status(404).json({ error: "Appointment not found" });
      return;
    }

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting appointment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
