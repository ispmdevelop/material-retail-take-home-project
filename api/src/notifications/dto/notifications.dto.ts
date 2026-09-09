export class NotificationResponseDto {
  id: string;
  title: string;
  description: string;
  action: string;
  isSeenOnApp: boolean;
  isEmailSent: boolean;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
}

export class MarkAllAsReadResponseDto {
  updatedCount: number;
}
