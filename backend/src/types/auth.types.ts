export interface ClinicianSignupRequest {
  fullName: string;
  email: string;
  phone?: string;
  password: string;
  confirmPassword: string;
}

export interface ClinicianLoginRequest {
  email: string;
  password: string;
}

export interface ClinicianJwtPayload {
  clinicianId: string;
  email: string;
}

