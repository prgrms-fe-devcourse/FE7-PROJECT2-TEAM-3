import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import supabase from "../../utils/supabase";
import loading_img from "../../assets/image/loding_image.png";

export default function AuthCallback() {
  const navigate = useNavigate();
  const claims = useAuthStore((state) => state.claims);

  useEffect(() => {
    const processUser = async () => {
      if (!claims?.sub) return;

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("exp")
        .eq("_id", claims.sub)
        .maybeSingle();

      if (error) {
        console.error("프로필 조회 에러:", error);
        navigate("/login");
        return;
      }

      if (profile && profile.exp !== null) {
        await supabase
          .from("profiles")
          .update({ is_online: true })
          .eq("_id", claims.sub);
        navigate("/home");
      } else {
        await supabase.from("profiles").insert([
          {
            _id: claims.sub,
            exp: 0,
            badge: "치킨 미개봉자",
            level: 0,
            is_online: true,
            bio: "",
          },
        ]);
        navigate("/userSetting");
      }
    };

    if (claims?.sub) {
      processUser();
    }
  }, [claims?.sub, navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-full w-full">
      <img
        className="rounded-full w-full h-full object-cover shadow-2xl animate-bounce-slow"
        src={loading_img}
        alt={"로딩중 이미지"}
      />

      <p className="text-xl font-bold text-blue-400 tracking-widest animate-pulse">
        로딩중...
      </p>
    </div>
  );
}
