export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5";
  };
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          extensions?: Json;
          operationName?: string;
          query?: string;
          variables?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      channels: {
        Row: {
          _id: string;
          description: string | null;
          name: string;
        };
        Insert: {
          _id: string;
          description?: string | null;
          name: string;
        };
        Update: {
          _id?: string;
          description?: string | null;
          name?: string;
        };
        Relationships: [];
      };
      chat_rooms: {
        Row: {
          created_at: string;
          id: string;
          participants: string[];
        };
        Insert: {
          created_at?: string;
          id?: string;
          participants: string[];
        };
        Update: {
          created_at?: string;
          id?: string;
          participants?: string[];
        };
        Relationships: [];
      };
      comments: {
        Row: {
          _id: string;
          comment: string;
          created_at: string;
          post_id: string;
          update_at: string;
          user_id: string;
        };
        Insert: {
          _id?: string;
          comment: string;
          created_at?: string;
          post_id?: string;
          update_at?: string;
          user_id?: string;
        };
        Update: {
          _id?: string;
          comment?: string;
          created_at?: string;
          post_id?: string;
          update_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "comments_post_id_fkey";
            columns: ["post_id"];
            isOneToOne: false;
            referencedRelation: "posts";
            referencedColumns: ["_id"];
          },
          {
            foreignKeyName: "comments_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["_id"];
          },
        ];
      };
      follows: {
        Row: {
          _id: string;
          created_at: string;
          follower_id: string;
          following_id: string;
        };
        Insert: {
          _id?: string;
          created_at?: string;
          follower_id?: string;
          following_id?: string;
        };
        Update: {
          _id?: string;
          created_at?: string;
          follower_id?: string;
          following_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "follows_follower_id_fkey";
            columns: ["follower_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["_id"];
          },
          {
            foreignKeyName: "follows_following_id_fkey";
            columns: ["following_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["_id"];
          },
        ];
      };
      hashtags: {
        Row: {
          _id: string;
          created_at: string;
          hashtag: string;
          post_id: string;
        };
        Insert: {
          _id?: string;
          created_at?: string;
          hashtag: string;
          post_id?: string;
        };
        Update: {
          _id?: string;
          created_at?: string;
          hashtag?: string;
          post_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "hashtags_post_id_fkey";
            columns: ["post_id"];
            isOneToOne: false;
            referencedRelation: "posts";
            referencedColumns: ["_id"];
          },
        ];
      };
      images: {
        Row: {
          _id: string;
          created_at: string;
          post_id: string;
          src: string | null;
        };
        Insert: {
          _id?: string;
          created_at?: string;
          post_id?: string;
          src?: string | null;
        };
        Update: {
          _id?: string;
          created_at?: string;
          post_id?: string;
          src?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "images_post_id_fkey";
            columns: ["post_id"];
            isOneToOne: false;
            referencedRelation: "posts";
            referencedColumns: ["_id"];
          },
        ];
      };
      likes: {
        Row: {
          _id: string;
          created_at: string;
          post_id: string | null;
          update_at: string | null;
          user_id: string | null;
        };
        Insert: {
          _id?: string;
          created_at?: string;
          post_id?: string | null;
          update_at?: string | null;
          user_id?: string | null;
        };
        Update: {
          _id?: string;
          created_at?: string;
          post_id?: string | null;
          update_at?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "likes_post_id_fkey";
            columns: ["post_id"];
            isOneToOne: false;
            referencedRelation: "posts";
            referencedColumns: ["_id"];
          },
          {
            foreignKeyName: "likes_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["_id"];
          },
        ];
      };
      messages: {
        Row: {
          content: string;
          created_at: string;
          id: string;
          room_id: string | null;
          user_id: string | null;
        };
        Insert: {
          content: string;
          created_at?: string;
          id?: string;
          room_id?: string | null;
          user_id?: string | null;
        };
        Update: {
          content?: string;
          created_at?: string;
          id?: string;
          room_id?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "messages_room_id_fkey";
            columns: ["room_id"];
            isOneToOne: false;
            referencedRelation: "chat_rooms";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "messages_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["_id"];
          },
        ];
      };
      notifications: {
        Row: {
          _id: string;
          actor_id: string;
          created_at: string;
          is_read: boolean;
          target_post_id: string | null;
          type: string;
          user_to_notify: string;
        };
        Insert: {
          _id?: string;
          actor_id?: string;
          created_at?: string;
          is_read?: boolean;
          target_post_id?: string | null;
          type: string;
          user_to_notify?: string;
        };
        Update: {
          _id?: string;
          actor_id?: string;
          created_at?: string;
          is_read?: boolean;
          target_post_id?: string | null;
          type?: string;
          user_to_notify?: string;
        };
        Relationships: [
          {
            foreignKeyName: "notification_actor_id_fkey";
            columns: ["actor_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["_id"];
          },
          {
            foreignKeyName: "notification_target_post_id_fkey";
            columns: ["target_post_id"];
            isOneToOne: false;
            referencedRelation: "posts";
            referencedColumns: ["_id"];
          },
          {
            foreignKeyName: "notification_user_to_notify_fkey";
            columns: ["user_to_notify"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["_id"];
          },
        ];
      };
      posts: {
        Row: {
          _id: string;
          channel_id: string | null;
          content: string;
          created_at: string;
          title: string;
          update_at: string;
          user_id: string;
        };
        Insert: {
          _id?: string;
          channel_id?: string | null;
          content: string;
          created_at?: string;
          title: string;
          update_at?: string;
          user_id?: string;
        };
        Update: {
          _id?: string;
          channel_id?: string | null;
          content?: string;
          created_at?: string;
          title?: string;
          update_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "posts_channel_id_fkey";
            columns: ["channel_id"];
            isOneToOne: false;
            referencedRelation: "channels";
            referencedColumns: ["_id"];
          },
          {
            foreignKeyName: "posts_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["_id"];
          },
        ];
      };
      profiles: {
        Row: {
          _id: string;
          badge: string | null;
          bio: string | null;
          cover_image: string | null;
          display_name: string;
          email: string | null;
          exp: number | null;
          is_online: boolean | null;
          level: number | null;
          profile_image: string | null;
        };
        Insert: {
          _id?: string;
          badge?: string | null;
          bio?: string | null;
          cover_image?: string | null;
          display_name: string;
          email?: string | null;
          exp?: number | null;
          is_online?: boolean | null;
          level?: number | null;
          profile_image?: string | null;
        };
        Update: {
          _id?: string;
          badge?: string | null;
          bio?: string | null;
          cover_image?: string | null;
          display_name?: string;
          email?: string | null;
          exp?: number | null;
          is_online?: boolean | null;
          level?: number | null;
          profile_image?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const;
