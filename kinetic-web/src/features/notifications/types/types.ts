export type Notification = {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  dismissible?: boolean;
  onDismiss?: () => void;
};
