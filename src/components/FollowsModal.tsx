import { useEffect, useState } from "react";
import supabase from "../utils/supabase";
import { useParams } from "react-router";
import { X } from "lucide-react";
import FollowList from "./FollowList";

type FollowsModalType = "followerModal" | "followingModal";

interface FollowsModalProps {
  onClose: () => void;
  ModalType: FollowsModalType;
}

type FollowsProfile = {
  _id: string;
  display_name: string;
  profile_image: string | null;
  bio: string | null;
  badge: string | null;
  level: number;
};

export default function FollowsModal({
  onClose,
  ModalType,
}: FollowsModalProps) {
  const { userId } = useParams();
  const [profiles, setProfiles] = useState<FollowsProfile[]>([]);

  useEffect(() => {
    const fetchFollows = async () => {
      try {
        const { data: followerData, error: followerError } = await supabase
          .from("follows")
          .select(
            `
          follower_id, 
          follower_id (
            _id,
            display_name,
            profile_image,
            bio,
            badge,
            level
          )
        `
          )
          .eq("following_id", userId);

        const { data: followingData, error: followingError } = await supabase
          .from("follows")
          .select(
            `
          following_id, 
          following_id (
            _id,
            display_name,
            profile_image,
            bio,
            badge,
            level
          )
        `
          )
          .eq("follower_id", userId);

        if (followerData && ModalType === "followerModal") {
          const profileData = followerData
            .map((follow) => follow.follower_id)
            .filter((profile): profile is FollowsProfile => profile !== null);

          setProfiles(profileData);
        }
        if (followingData && ModalType === "followingModal") {
          const profileData = followingData
            .map((follow) => follow.following_id)
            .filter((profile): profile is FollowsProfile => profile !== null);

          setProfiles(profileData);
        }

        if (followerError) {
          throw followerError;
        }
        if (followingError) {
          throw followingError;
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchFollows();
  }, [userId, ModalType]);

  return (
    <div>
      <div className="flex justify-between items-center p-5 border-b border-[#303A4B]">
        <h2 className="text-xl font-bold text-white">
          {" "}
          {ModalType === "followerModal" ? "팔로워" : "팔로잉"} 목록
        </h2>
        {/* 닫기 버튼 (X 아이콘을 직접 가정하여 classNameName만 적용) */}
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>
      </div>
      {profiles.length === 0 && (
        <div className="h-64 flex justify-center items-center">
          <p className="text-gray-500 text-base">
            {ModalType === "followerModal" ? "팔로워" : "팔로잉"}목록이
            없습니다.
          </p>
        </div>
      )}
      <div className="max-h-[600px] overflow-y-auto">
        {profiles.map((profile) => {
          return (
            <FollowList key={profile._id} profile={profile} onClose={onClose} />
          );
        })}
      </div>
    </div>
  );
}
