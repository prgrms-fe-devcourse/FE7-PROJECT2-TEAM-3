import type { Database } from "./database";

type AppNotification = Database["public"]["Tables"]["notifications"]["Row"];

export type NotificationJoined = Omit<
  AppNotification,
  "actor_id" | "target_post_id"
> & {
  actor: {
    _id: string;
    display_name: string;
    profile_image: string | null;
  } | null;
  post?: {
    _id: string;
    title: string;
  } | null;
};

interface NotificationProps {
  notifications: NotificationJoined[];
  setNotifications: React.Dispatch<React.SetStateAction<NotificationJoined[]>>;
}
