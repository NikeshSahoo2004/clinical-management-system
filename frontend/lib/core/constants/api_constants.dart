class ApiConstants {
  // this url will be updated after backend is deployed
  static const String baseUrl = 'http://localhost:4000/api';

  // Auth endpoints
  static const String login = '/auth/login';
  static const String register = '/auth/register';

  // Clinician endpoints
  static const String clinicians = '/clinicians';
  static String clinicanById(String id) => '/clinician/$id';

  // Appointment endpoints
  static const String appointments = '/appointments';
  static String appointmentsByPatient(String id) => '/appointments/patients/$id';

  // Treatment plan endpoints
  static const String treatmentPlans = '/treatment_plans';

  // Analytics endpoints
  static const String analytics = '/analytics';
}