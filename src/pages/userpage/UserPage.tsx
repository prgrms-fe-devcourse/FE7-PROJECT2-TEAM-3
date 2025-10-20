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
import FollowerModal from "../../components/FollowerModal";
import { twMerge } from "tailwind-merge";
import type { PostListItem, PostSearchItem } from "../../types/post";
import UserPagePosts from "../../components/userPage/UserPagePosts";

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

  // 진환
  // 작성글, 댓글 전환용 상태
  const [activeTab, setActiveTab] = useState<"posts" | "comments">("posts");
  const [posts, setPosts] = useState<PostListItem[]>([]);

  // 로그인 페이지 이동 함수
  const directLogin = () => {
    navigate("/login");
  };

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
  // 팔로잉 & 팔로우 수, 팔로잉 & 팔로우 목록 불러오기
  useEffect(() => {
    if (!userId) {
      return;
    }

    const fetchAllData = async () => {
      try {
        // 4개의 요청을 'await' 없이 준비
        const profilePromise = supabase
          .from("profiles")
          .select("*")
          .eq("_id", userId)
          .single();

        const followingCountPromise = supabase
          .from("follows")
          .select("following_id", { count: "exact", head: true })
          .eq("follower_id", userId);

        const followerCountPromise = supabase
          .from("follows")
          .select("follower_id", { count: "exact", head: true })
          .eq("following_id", userId);

        // myProfile.id가 있을 때만 'isFollowing'을 체크
        const isFollowingPromise = myProfile?._id
          ? supabase
              .from("follows")
              .select("", { count: "exact", head: true })
              .eq("follower_id", myProfile._id)
              .eq("following_id", userId)
          : Promise.resolve({ count: 0, error: null }); // 로그인 안했으면 'false'로 간주

        //  Promise.all로 모든 요청을 동시에 실행
        const [
          profileResponse,
          followingResponse,
          followerResponse,
          isFollowingResponse,
        ] = await Promise.all([
          profilePromise,
          followingCountPromise,
          followerCountPromise,
          isFollowingPromise,
        ]);

        // 각 응답의 에러를 개별적으로 확인
        if (profileResponse.error) throw profileResponse.error;
        if (followingResponse.error) throw followingResponse.error;
        if (followerResponse.error) throw followerResponse.error;
        if (isFollowingResponse.error) throw isFollowingResponse.error;

        //  모든 데이터가 성공적으로 오면 상태에 한 번에 반영
        setProfile(profileResponse.data);
        setFollowings(followingResponse.count || 0);
        setFollowers(followerResponse.count || 0);
        setIsFollowing((isFollowingResponse.count || 0) > 0);
      } catch (error) {
        console.error("프로필 데이터, 팔로우 데이터 로드 실패:", error);
      }
    };

    fetchAllData();
  }, [userId, myProfile?._id]);

  useEffect(() => {
    const postFetch = async () => {
      try {
        const { data: postsData, error: postsError } = await supabase
          .from("posts")
          .select(
            `
            _id,
            title,
            content,
            channel_id,
            created_at,
            user:profiles (display_name,profile_image,level, badge),
            likes:likes(count),
            comments:comments(count),
            hashtags (hashtag)`
          )
          .eq("user_id", profile._id);

        if (postsError) {
          console.error("Error fetching posts:", postsError);
          setPosts([]);
        } else if (postsData) {
          const formatted: PostListItem[] = (postsData || []).map(
            (post: PostSearchItem) => {
              const user = Array.isArray(post.user) ? post.user[0] : post.user;
              return {
                _id: post._id,
                title: post.title,
                content: post.content,
                channel_id: post.channel_id,
                created_at: post.created_at,
                user,
                likeCount:
                  Array.isArray(post.likes) && post.likes[0]?.count != null
                    ? post.likes[0].count
                    : 0,
                commentCount:
                  Array.isArray(post.comments) &&
                  post.comments[0]?.count != null
                    ? post.comments[0].count
                    : 0,
                hashtags: (post.hashtags ?? []).map(
                  (h: { hashtag: string }) => h.hashtag
                ),
              };
            }
          );
          setPosts(formatted);
        }
      } catch (e) {
        console.error(e);
      }
    };
    postFetch();
  }, [profile._id]);

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
            <Activity mode={!myProfile ? "visible" : "hidden"}>
              <button
                onClick={directLogin}
                className="bg-[#9297AC] hover:bg-[#696F86] text-white font-bold py-2 px-4 rounded-lg text-sm transition-colors"
              >
                로그인
              </button>
            </Activity>
          </div>

          <p className="text-sm text-gray-300 mt-4 mb-6">{profile.bio}</p>

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

        {/* 진환 파트 */}
        <div className="w-full mt-5 flex flex-col gap-6">
          <div className="flex justify-end border-b border-gray-700">
            <button
              onClick={() => setActiveTab("posts")}
              className={twMerge(
                "text-sm font-medium px-4 py-2 transition-colors",
                activeTab === "posts"
                  ? "text-white border-b-2 border-white"
                  : "text-gray-500 hover:text-white"
              )}
            >
              작성글
            </button>
            <button
              onClick={() => setActiveTab("comments")}
              className={twMerge(
                "text-sm font-medium px-4 py-2 transition-colors",
                activeTab === "comments"
                  ? "text-white border-b-2 border-white"
                  : "text-gray-500 hover:text-white"
              )}
            >
              댓글
            </button>
          </div>
          {/* 작성글, 댓글 불러오기 부분 */}
          <div>{activeTab === "posts" && <UserPagePosts posts={posts} />}</div>
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
        <FollowerModal onClose={closeFollowers} />
      </Modal>
      {/* 팔로잉 목록 모달 */}
      <Modal isOpen={isFollowingOpend} onClose={closeFollowings}>
        <FollowerModal onClose={closeFollowings} />
      </Modal>
    </div>
  );
}
