import React, { Activity, useEffect, useState } from "react";
import { X, Image as ImageIcon, XCircle } from "lucide-react"; // 아이콘 임포트
import { useAuthStore } from "../stores/authStore";
import supabase from "../utils/supabase";
import CoverImage from "./ui/CoverImage";
import ProfileImage from "./ui/ProfileImage";

type SetUpModalProps = {
  onClose: () => void;
};

export default function SetUpModal({ onClose }: SetUpModalProps) {
  const claims = useAuthStore((state) => state.claims);
  const profile = useAuthStore((state) => state.profile);
  const setProfile = useAuthStore.getState().setProfile;
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    cover_image: "",
    profile_image: "",
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data, error } = await supabase
      .from("profiles")
      .update({
        display_name: formData.name,
        bio: formData.bio,
        cover_image: formData.cover_image,
        profile_image: formData.profile_image,
      })
      .eq("_id", profile?._id)
      .select()
      .single();
    if (error) throw error;
    if (data) {
      alert("회원정보 수정이 완료 되었습니다!");
      setProfile(data);
      onClose();
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target;
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const reader = new FileReader();

    reader.onload = (ev) => {
      const fileContent = ev.target?.result;
      if (typeof fileContent === "string") {
        setFormData((prev) => ({
          ...prev,
          [name]: fileContent,
        }));
      }
    };

    reader.readAsDataURL(file);
  };

  useEffect(() => {
    const fetchUser = async () => {
      if (claims?.sub) {
        const { error } = await supabase
          .from("profiles")
          .select("*")
          .eq("_id", claims.sub)
          .single();

        if (error) {
          console.error(error);
          return;
        }
      }
    };

    fetchUser();

    if (profile) {
      setFormData({
        name: profile.display_name || "",
        bio: profile.bio || "",
        cover_image: profile.cover_image || "",
        profile_image: profile.profile_image || "",
      });
    }
  }, [profile, claims?.sub]);

  return (
    <div className="w-full max-w-150 bg-[#1A2537] rounded-lg overflow-hidden text-white shadow-xl">
      <div className="flex justify-between items-center p-4 border-b border-[#303A4B]">
        <h2 className="text-xl font-bold">회원정보 수정</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors cursor-pointer"
        >
          <X size={24} />
        </button>
      </div>

      <div className="relative h-40 bg-[#303A4B]">
        <Activity mode={formData.cover_image ? "visible" : "hidden"}>
          <CoverImage
            className="w-full h-full object-cover"
            src={formData.cover_image}
            alt={formData.name + "님의 배경 이미지"}
          />
        </Activity>
        <Activity mode={!formData.cover_image ? "visible" : "hidden"}>
          <div className="w-full h-full bg-[#303A4B] flex items-center justify-center text-gray-500">
            배경 이미지를 추가하세요
          </div>
        </Activity>

        <div className="absolute top-2 right-2 flex gap-2">
          <label className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-700 hover:bg-gray-600 cursor-pointer transition-colors">
            <ImageIcon size={16} className="text-white" />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              name="cover_image"
              onChange={handleImageUpload}
            />
          </label>
          <Activity mode={formData.cover_image ? "visible" : "hidden"}>
            <button
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  cover_image: "",
                }))
              }
              className="flex items-center justify-center w-8 h-8 rounded-full bg-red-600 hover:bg-red-700 transition-colors cursor-pointer"
            >
              <XCircle size={16} className="text-white" />
            </button>
          </Activity>
        </div>
      </div>

      <div className="relative p-6 -mt-16 z-10">
        {" "}
        <div className="relative w-28 h-28 rounded-full border-4 border-[#1A2537] bg-gray-600 overflow-hidden">
          <ProfileImage
            src={formData.profile_image}
            alt={formData.name + "님의 프로필 이미지"}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity">
            {/* 프로필 이미지 변경 버튼 */}
            <label className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-600 cursor-pointer">
              <ImageIcon size={20} className="text-white" />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                name="profile_image"
                onChange={handleImageUpload}
              />
            </label>
            {/* 프로필 이미지 삭제 버튼 */}
            <Activity mode={formData.profile_image ? "visible" : "hidden"}>
              <button
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    profile_image: "",
                  }))
                }
                className="ml-2 flex items-center justify-center w-10 h-10 rounded-full bg-red-600 hover:bg-red-700 cursor-pointer"
              >
                <XCircle size={20} className="text-white" />
              </button>
            </Activity>
          </div>
        </div>
      </div>

      <div className="p-6 pt-0 space-y-4">
        <div>
          <label
            htmlFor="displayName"
            className="block text-gray-400 text-sm font-bold mb-2"
          >
            닉네임
          </label>

          <input
            type="text"
            id="displayName"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full p-3 rounded-md bg-[#161C27] border border-[#303A4B] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="닉네임을 입력하세요."
            required
          />
        </div>
        <div>
          <label
            htmlFor="bio"
            className="block text-gray-400 text-sm font-bold mb-2"
          >
            자기소개
          </label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            className="w-full p-3 rounded-md bg-[#161C27] border border-[#303A4B] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder="자기소개를 입력하세요..."
            rows={4}
          ></textarea>
        </div>
      </div>

      {/* 5. 저장 버튼 */}
      <div className="p-6 pt-0">
        <button
          onClick={handleSave}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md transition-colors cursor-pointer"
        >
          저장
        </button>
      </div>
    </div>
  );
}
