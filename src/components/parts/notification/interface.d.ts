interface NotificationResponse {
  id: number;
  type: string;
  message: string;
  refId: string;
  createdAt: string;
  readStatus: boolean;
  readAt: any;
  deliveredAt: string;
}

interface NotificationCountResponse {
  totalUnRead: number;
}
