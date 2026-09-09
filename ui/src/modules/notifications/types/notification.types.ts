export interface Notification {
  id: string;
  title: string;
  description: string;
  action: string;
  isSeenOnApp: boolean;
  isEmailSent: boolean;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
}
