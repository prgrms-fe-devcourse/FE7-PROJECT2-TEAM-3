import type { Database } from "./database";

type AppNotification = Database["public"]["Tables"]["notifications"]["Row"];

interface NotificationProps {
  notifications: AppNotification[];
  setNotifications: React.Dispatch<React.SetStateAction<AppNotification[]>>;
}
