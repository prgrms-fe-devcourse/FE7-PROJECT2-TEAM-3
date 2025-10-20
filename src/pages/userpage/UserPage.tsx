import { Activity, useEffect, useState } from "react";
import { useAuthStore } from "../../stores/authStore";
import { useNavigate, useParams } from "react-router";
import supabase from "../../utils/supabase";
import ProfileImage from "../../components/ui/ProfileImage";
import CoverImage from "../../components/ui/CoverImage";
import { LogOut, Pencil } from "lucide-react";
import Modal from "../../components/Modal";
import type { Profile } from "../../types/profile";
import SetUpModal from "../../components/SetUpModal";
import FollowsModal from "../../components/FollowsModal";

export default function ProfileHeaderSection() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const myProfile = useAuthStore((state) => state.profile);

  // 팔로워, 팔로잉 수 상태
  const [followers, setFollowers] = useState<number>(0);
  const [followings, setFollowings] = useState<number>(0);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);

  // 모달 상태 관리
  const [isSetUpOpened, setIsSetUpOpened] = useState(false); // 프로필 수정 모달
  const [isFollowerOpend, setIsFollowerOpend] = useState<boolean>(false); // 팔로워 모달
  const [isFollowingOpend, setIsFollowingOpend] = useState<boolean>(false); // 팔로잉 모달

  // 모달 열기/닫기 함수
  const openSetUp = () => setIsSetUpOpened(true); // 프로필 수정 모달
  const closeSetUp = () => setIsSetUpOpened(false);
  const openFollowers = () => setIsFollowerOpend(true); // 팔로워 모달
  const closeFollowers = () => setIsFollowerOpend(false);
  const openFollowings = () => setIsFollowingOpend(true); // 팔로잉 모달
  const closeFollowings = () => setIsFollowingOpend(false);
  const [profile, setProfile] = useState<Profile>({
    _id: "",
    badge: null,
    bio: null,
    cover_image: null,
    display_name: "",
    email: null,
    exp: null,
    is_online: null,
    profile_image: null,
    level: 0,
  });
  // 해당 페이지 유저 프로필 정보 불러오기
  useEffect(() => {
    if (userId) {
      const fetchProfile = async () => {
        try {
          const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("_id", userId)
            .single();
          if (error) {
            throw error;
          }
          setProfile(data);
        } catch (error) {
          console.log(error);
        }
      };
      fetchProfile();
    }
  }, [userId, myProfile]);
  // 팔로잉 & 팔로우 수, 팔로잉 & 팔로우 목록 불러오기
  useEffect(() => {
    if (userId) {
      const fetchfollows = async () => {
        const { count: followingCount } = await supabase
          .from("follows")
          .select("following_id", { count: "exact", head: true })
          .eq("follower_id", userId);
        const { count: followerCount } = await supabase
          .from("follows")
          .select("follower_id", { count: "exact", head: true })
          .eq("following_id", userId);
        const { count: isFollowingData } = await supabase
          .from("follows")
          .select("", { count: "exact", head: true })
          .eq("follower_id", myProfile?._id)
          .eq("following_id", userId);
        setFollowings(followingCount || 0);
        setFollowers(followerCount || 0);
        setIsFollowing(isFollowingData === 1 || false);
      };
      fetchfollows();
    }
  }, [userId, myProfile?._id]);
  //팔로우 하는 함수
  const followSubmit = async () => {
    if (!myProfile?._id || myProfile._id === userId) return;
    try {
      const { data, error } = await supabase
        .from("follows")
        .insert([{ follower_id: myProfile._id, following_id: userId }])
        .select();
      if (error) throw error;
      if (data) {
        setIsFollowing(true);
        setFollowers((prevCount) => prevCount + 1);
      }
    } catch (error) {
      console.log(error);
    }
  };
  //언팔로우 하는 함수
  const unfollowSubmit = async () => {
    try {
      const { error } = await supabase
        .from("follows")
        .delete()
        .eq("follower_id", myProfile?._id)
        .eq("following_id", userId);
      if (error) {
        throw error;
      }
      setIsFollowing(false);
      setFollowers((prevCount) => prevCount - 1);
    } catch (error) {
      console.error(error);
    }
  };
  // 로그아웃 처리 함수
  async function signOut() {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ is_online: false })
        .eq("_id", myProfile?._id)
        .select();
      if (error) throw error;
    } catch (e) {
      console.error(e);
    }
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (e) {
      console.error(e);
    }
    navigate("/home");
  }

  const maxExp = 100;
  const currentExp = Number(profile.exp ?? 0); // exp가 null일 경우를 대비
  const expPercentage = currentExp % maxExp; // 채운 경험치 계산
  const expRemaining = maxExp - expPercentage; // 남은 경험치 계산

  return (
    <div className="w-full">
      <div className="fixed top-[104px] right-[352px] left-[352px]">
        <div className="w-full h-[200px] bg-gray-200 rounded-t-lg">
          <CoverImage
            className="w-full h-full object-cover"
            src={profile.cover_image}
            alt={profile.display_name + "님의 배경 이미지"}
          />
        </div>
        <div className="bg-[#161C27] rounded-b-lg p-6 shadow-lg relative">
          <div className="flex justify-between items-center">
            <div className="flex items-start gap-2 -mt-12">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#161C27]">
                <ProfileImage
                  className="w-full h-full object-cover"
                  src={profile.profile_image}
                  alt={profile.display_name}
                />
              </div>
              <div className="flex flex-col pt-12">
                <div className="px-2 flex items-center gap-2">
                  <span className="text-white text-xl font-bold">
                    {profile.display_name}
                  </span>
                  <div className="text-xs px-2 py-0.5 rounded-full bg-gray-500 text-white whitespace-nowrap">
                    {profile.badge}
                  </div>
                </div>
                <div className="text-sm text-gray-400">
                  {/* 팔로잉/팔로우 수 - 임시 데이터 */}
                  <button
                    className="hover:bg-[#303A4B] rounded-md px-2 py-[2] transition-colors"
                    onClick={openFollowings}
                  >
                    {followings} 팔로잉
                  </button>
                  <button
                    className="hover:bg-[#303A4B] rounded-md px-2 py-[2] transition-colors"
                    onClick={openFollowers}
                  >
                    {followers} 팔로워
                  </button>
                </div>
              </div>
            </div>
            {/* 우측 버튼 그룹 */}
            <Activity mode={userId === myProfile?._id ? "visible" : "hidden"}>
              <div className="flex gap-2 self-start pt-2">
                <button
                  className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-2 rounded-md transition-colors flex items-center gap-1"
                  onClick={signOut}
                >
                  <LogOut size={14} /> 로그아웃
                </button>

                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-2 rounded-md transition-colors flex items-center gap-1"
                  onClick={openSetUp}
                >
                  <Pencil size={14} /> 수정
                </button>
              </div>
            </Activity>
            <Activity
              mode={
                myProfile && userId !== myProfile?._id && !isFollowing
                  ? "visible"
                  : "hidden"
              }
            >
              <button
                onClick={followSubmit}
                className="bg-[#5C4DCA] hover:bg-[#7b6cdb] text-white font-bold py-2 px-4 rounded-lg text-sm transition-colors"
              >
                팔로우
              </button>
            </Activity>
            <Activity
              mode={
                myProfile && userId !== myProfile?._id && isFollowing
                  ? "visible"
                  : "hidden"
              }
            >
              <button
                onClick={unfollowSubmit}
                className="bg-[#9297AC] hover:bg-[#696F86] text-white font-bold py-2 px-4 rounded-lg text-sm transition-colors"
              >
                팔로잉
              </button>
            </Activity>
          </div>
          <p className="text-sm text-gray-300 mt-4 mb-6 overflow-hidden text-ellipsis display-box line-clamp-6">
            {profile.bio}
          </p>
          <div className="flex items-center text-xs">
            <div className="text-yellow-500 font-bold text-lg mr-4">
              Lv.{profile.level}
            </div>
            <div className="w-1/2 flex flex-col gap-2 mr-4">
              <div className="bg-gray-800 rounded-sm h-4 relative overflow-hidden">
                <div
                  className="bg-[#FFC300] h-full rounded-sm transition-all duration-500"
                  style={{ width: `${expPercentage}%` }}
                ></div>
              </div>

              <div className="w-full flex justify-between text-sm">
                <span className="text-gray-300 font-medium whitespace-nowrap">
                  레벨 {profile.level! + 1}까지 {expRemaining}exp 남음
                </span>

                <span className="text-yellow-500 font-medium whitespace-nowrap">
                  Max {maxExp}exp
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full mt-1">
          <div className="flex justify-end border-b border-gray-700">
            <button className="text-sm font-medium px-4 py-2 text-white border-b-2 border-white transition-colors">
              작성글
            </button>

            <button className="text-sm font-medium px-4 py-2 text-gray-500 hover:text-white transition-colors">
              댓글
            </button>
          </div>
        </div>
      </div>
      {/* 작성글 또는 댓글 리스트 영역 */}
      <div className="w-full rounded-lg p-6 mt-4 min-h-[500px]">
        {/* <Outlet /> */}
      </div>
      {/* 수정 모달 */}
      <Modal isOpen={isSetUpOpened} onClose={closeSetUp}>
        <SetUpModal onClose={closeSetUp} />
      </Modal>
      {/* 팔로워 목록 모달 */}
      <Modal isOpen={isFollowerOpend} onClose={closeFollowers}>
        <FollowsModal onClose={closeFollowers} ModalType={"followerModal"} />
      </Modal>
      {/* 팔로잉 목록 모달 */}
      <Modal isOpen={isFollowingOpend} onClose={closeFollowings}>
        <FollowsModal onClose={closeFollowings} ModalType={"followingModal"} />
      </Modal>
    </div>
  );
}
