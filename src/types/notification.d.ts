type Notification = Database["public"]["Tables"]["notifications"]["Row"];

interface NotificationProps {
  notifications: Notification[];
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
}
