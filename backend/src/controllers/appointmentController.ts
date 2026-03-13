import { Request, Response } from "express";
import * as appointmentService from "../services/appointmentService";
import { AppointmentQuery, AppointmentStatus } from "../types/appointmentTypes";

export async function getAll(req: Request, res: Response): Promise<void> {
  try {
    const query: AppointmentQuery = {
      page: req.query.page ? parseInt(req.query.page as string, 10) : undefined,
      limit: req.query.limit ? parseInt(req.query.limit as string, 10) : undefined,
      status: req.query.status as AppointmentQuery["status"],
      clinicianId: req.query.clinicianId as string,
      patientId: req.query.patientId as string,
      appointmentType: req.query.appointmentType as AppointmentQuery["appointmentType"],
      from: req.query.from as string,
      to: req.query.to as string,
    };

    // Use populated variant when ?populate=clinician is provided
    if (req.query.populate === "clinician") {
      const result = await appointmentService.getAllAppointmentsPopulated(query);
      res.json(result);
      return;
    }

    const result = await appointmentService.getAllAppointments(query);
    res.json(result);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getById(req: Request, res: Response): Promise<void> {
  try {
    const id = req.params.id as string;

    // Use populated variant when ?populate=clinician is provided
    if (req.query.populate === "clinician") {
      const appointment = await appointmentService.getAppointmentByIdPopulated(id);
      if (!appointment) {
        res.status(404).json({ error: "Appointment not found" });
        return;
      }
      res.json(appointment);
      return;
    }

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
  } catch (error: any) {
    if (error.name === "ReferentialIntegrityError") {
      res.status(422).json({ error: error.message });
      return;
    }
    if (error.name === "OverlapError") {
      res.status(409).json({ error: error.message });
      return;
    }
    if (error.name === "ValidationError") {
      res.status(400).json({ error: error.message });
      return;
    }
    console.error("Error creating appointment:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
}

export async function update(req: Request, res: Response): Promise<void> {
  try {
    const id = req.params.id as string;
    const appointment = await appointmentService.updateAppointment(id, req.body);

    if (!appointment) {
      res.status(404).json({ error: "Appointment not found" });
      return;
    }

    res.json(appointment);
  } catch (error: any) {
    if (error.name === "ReferentialIntegrityError") {
      res.status(422).json({ error: error.message });
      return;
    }
    if (error.name === "OverlapError") {
      res.status(409).json({ error: error.message });
      return;
    }
    if (error.name === "ValidationError") {
      res.status(400).json({ error: error.message });
      return;
    }
    console.error("Error updating appointment:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
}

export async function patchStatus(req: Request, res: Response): Promise<void> {
  try {
    const id = req.params.id as string;
    const { status } = req.body as { status: AppointmentStatus };

    const appointment = await appointmentService.updateAppointmentStatus(id, status);

    if (!appointment) {
      res.status(404).json({ error: "Appointment not found" });
      return;
    }

    res.json(appointment);
  } catch (error: any) {
    if (error.name === "StatusTransitionError") {
      res.status(422).json({ error: error.message });
      return;
    }
    console.error("Error updating appointment status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function remove(req: Request, res: Response): Promise<void> {
  try {
    const id = req.params.id as string;
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
