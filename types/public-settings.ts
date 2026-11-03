// GET /api/settings/public. Never hard-code these in the UI.
export type PublicSettings = {
  consultations: {
    consultations_free_change_hours: number;
    consultations_join_early_minutes: number;
    consultations_call_grace_minutes: number;
    consultations_booking_days: number;
    consultations_min_notice_minutes: number;
    consultations_time_step_minutes: number;
    consultations_report_window_hours: number;
    consultations_report_reply_hours: number;
    consultations_reminder_hours: number;
    consultations_reminder_minutes: number;
  };
  legal_services: {
    legal_services_review_window_days: number;
    legal_services_max_request_files: number;
    legal_services_max_delivery_files: number;
  };
  cases: {
    cases_max_documents: number;
  };
  security: {
    otp_expiry_minutes: number;
    otp_resend_cooldown_seconds: number;
  };
};
