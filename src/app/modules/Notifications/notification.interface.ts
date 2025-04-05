export type TNotification = {
  admin? : string;
  order? : string;
  message: string;
  status: 'read' | 'unread';
};
