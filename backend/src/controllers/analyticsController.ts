import { Request, Response } from "express";
import * as analyticsService from "../services/analyticsService";
import { ClinicalAnalyticsQuery } from "../types/analyticsTypes";

/** Matches a plain YYYY-MM-DD string with no time component. */
export const DATE_ONLY_RE = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Normalizes an optional date query-param value:
 * - `YYYY-MM-DD` as startDate → `YYYY-MM-DDT00:00:00.000Z`
 * - `YYYY-MM-DD` as endDate   → `YYYY-MM-DDT23:59:59.999Z`
 * - Full ISO strings pass through unchanged.
 */
function normalizeDate(value: string | undefined, position: "start" | "end"): string | undefined {
  if (!value) return undefined;
  if (DATE_ONLY_RE.test(value)) {
    return position === "start"
      ? `${value}T00:00:00.000Z`
      : `${value}T23:59:59.999Z`;
  }
  return value;
}

export async function getClinicalAnalytics(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const query: ClinicalAnalyticsQuery = {
      startDate: normalizeDate(req.query.startDate as string | undefined, "start"),
      endDate: normalizeDate(req.query.endDate as string | undefined, "end"),
      status: req.query.status as ClinicalAnalyticsQuery["status"],
      clinicianId: req.query.clinicianId as string,
      patientId: req.query.patientId as string,
      appointmentType: req.query.appointmentType as ClinicalAnalyticsQuery["appointmentType"],
      location: req.query.location as ClinicalAnalyticsQuery["location"],
      billingStatus: req.query.billingStatus as ClinicalAnalyticsQuery["billingStatus"],
    };

    const analytics = await analyticsService.getClinicalAnalytics(query);
    res.json(analytics);
  } catch (error) {
    console.error("Error fetching clinical analytics:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function exportAnalytics(req: Request, res: Response): Promise<void> {
  try {
    const body = req.body as Record<string, string | undefined>;
    const query: ClinicalAnalyticsQuery = {
      startDate: normalizeDate(body.startDate, "start"),
      endDate: normalizeDate(body.endDate, "end"),
      status: body.status as ClinicalAnalyticsQuery["status"],
      clinicianId: body.clinicianId,
      patientId: body.patientId,
      appointmentType: body.appointmentType as ClinicalAnalyticsQuery["appointmentType"],
      location: body.location as ClinicalAnalyticsQuery["location"],
      billingStatus: body.billingStatus as ClinicalAnalyticsQuery["billingStatus"],
    };

    const csv = await analyticsService.exportAnalyticsAsCsv(query);
    const filename = `analytics-${new Date().toISOString().split("T")[0]}.csv`;

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.send(csv);
  } catch (error) {
    console.error("Error exporting analytics:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
